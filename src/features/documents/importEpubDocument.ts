import ePub from 'epubjs';
import type { Document } from '../../types/document';
import { chunkTextIntoSections } from './chunkText';

function slugifyFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function createDocumentId(fileName: string) {
  const base = slugifyFileName(fileName) || 'document';
  const suffix = crypto.randomUUID().slice(0, 8);

  return `${base}-${suffix}`;
}

function htmlToPlainText(html: string): string {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(html, 'text/html');

  const text = parsedDocument.body?.textContent ?? '';

  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

type EpubTocEntry = {
  href?: string;
  label?: string;
  subitems?: EpubTocEntry[];
};

type EpubDomDocumentLike = {
  documentElement?: {
    outerHTML?: string;
  };
};

type EpubSpineItem = {
  href?: string;
  document?: EpubDomDocumentLike;
  load: (loader: (href: string) => Promise<unknown>) => Promise<unknown>;
  unload?: () => void;
};

type EpubBookRuntime = {
  ready: Promise<unknown>;
  loaded: {
    navigation: Promise<{
      toc?: EpubTocEntry[];
    }>;
    spine: Promise<unknown>;
  };
  load: (href: string) => Promise<unknown>;
  spine?: {
    spineItems?: EpubSpineItem[];
  };
  package?: {
    metadata?: {
      title?: string;
      creator?: string;
    };
  };
  destroy: () => void;
};

function flattenToc(entries: EpubTocEntry[] = []): EpubTocEntry[] {
  const result: EpubTocEntry[] = [];

  for (const entry of entries) {
    result.push(entry);

    if (entry.subitems?.length) {
      result.push(...flattenToc(entry.subitems));
    }
  }

  return result;
}

export async function importEpubDocument(file: File): Promise<Document> {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer) as unknown as EpubBookRuntime;

  try {
    await book.ready;
    await book.loaded.spine;

    const navigation = await book.loaded.navigation.catch(() => undefined);
    const tocEntries = flattenToc(navigation?.toc ?? []);

    const spineItems = book.spine?.spineItems ?? [];

    if (spineItems.length === 0) {
      throw new Error('The EPUB does not contain any readable spine items.');
    }

    const extractedSections: Array<{ title: string; text: string }> = [];

    for (let index = 0; index < spineItems.length; index += 1) {
      const item = spineItems[index];

      const loadedContents = await item.load(book.load.bind(book));

      let html = '';

      if (typeof loadedContents === 'string') {
        html = loadedContents;
      } else if (
        typeof loadedContents === 'object' &&
        loadedContents !== null &&
        'documentElement' in loadedContents
      ) {
        const maybeDoc = loadedContents as { documentElement?: { outerHTML?: string } };
        html = maybeDoc.documentElement?.outerHTML ?? '';
      } else if (item.document?.documentElement?.outerHTML) {
        html = item.document.documentElement.outerHTML;
      }

      const plainText = htmlToPlainText(html);

      if (typeof item.unload === 'function') {
        item.unload();
      }

      if (!plainText) {
        continue;
      }

      const navEntry = tocEntries.find((entry) => {
        if (!entry.href || !item.href) {
          return false;
        }

        return entry.href.includes(item.href) || item.href.includes(entry.href);
      });

      extractedSections.push({
        title: navEntry?.label || `Chapter ${extractedSections.length + 1}`,
        text: plainText,
      });
    }

    if (extractedSections.length === 0) {
      throw new Error('The EPUB did not yield any readable text.');
    }

    const sections = extractedSections.flatMap((entry, index) => {
      const chunks = chunkTextIntoSections(entry.text, {
        titlePrefix: entry.title || `Chapter ${index + 1}`,
        chunkSize: 3500,
      });

      if (chunks.length === 0) {
        return [];
      }

      if (chunks.length === 1) {
        return [
          {
            id: `section-${index + 1}`,
            title: entry.title || `Chapter ${index + 1}`,
            chapterTitle: entry.title || `Chapter ${index + 1}`,
            text: chunks[0].text,
          },
        ];
      }

      return chunks.map((chunk, chunkIndex) => ({
        id: `section-${index + 1}-${chunkIndex + 1}`,
        title: `${entry.title || `Chapter ${index + 1}`} (${chunkIndex + 1}/${chunks.length})`,
        chapterTitle: entry.title || `Chapter ${index + 1}`,
        text: chunk.text,
      }));
    });

    if (sections.length === 0) {
      throw new Error('The EPUB did not produce any sections.');
    }

    const metadata = book.package?.metadata;
    const title =
      metadata?.title ||
      file.name.replace(/\.[^.]+$/, '') ||
      'Untitled EPUB';

    const author = metadata?.creator || undefined;
    const now = new Date().toISOString();

    return {
      id: createDocumentId(file.name),
      title,
      author,
      format: 'epub',
      description: `Imported from local file: ${file.name}`,
      createdAt: now,
      updatedAt: now,
      normalProgress: {
        sectionId: sections[0]?.id,
      },
      speedReadProgress: undefined,
      sections,
    };
  } finally {
    book.destroy();
  }
}
