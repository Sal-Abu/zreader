import * as pdfjsLib from 'pdfjs-dist';
import type { Document } from '../../types/document';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

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

function normalizeText(text: string) {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

type TextItemLike = {
  str?: string;
  transform?: number[];
  width?: number;
  height?: number;
};

type OutlineNodeLike = {
  title?: string;
  dest?: string | unknown[] | null;
  items?: OutlineNodeLike[];
};

type OutlinePageTitle = {
  pageNumber: number;
  title: string;
};

type PdfRefLike = {
  num: number;
  gen: number;
};

function flattenOutline(entries: OutlineNodeLike[] = []): OutlineNodeLike[] {
  const result: OutlineNodeLike[] = [];

  for (const entry of entries) {
    result.push(entry);

    if (entry.items?.length) {
      result.push(...flattenOutline(entry.items));
    }
  }

  return result;
}

function isPdfRefLike(value: unknown): value is PdfRefLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    'num' in value &&
    'gen' in value &&
    typeof (value as { num: unknown }).num === 'number' &&
    typeof (value as { gen: unknown }).gen === 'number'
  );
}

function extractOrderedPageText(items: TextItemLike[]): string {
  const positioned = items
    .filter(
      (item): item is Required<Pick<TextItemLike, 'str' | 'transform'>> & TextItemLike =>
        typeof item.str === 'string' &&
        !!item.transform &&
        Array.isArray(item.transform) &&
        item.transform.length >= 6,
    )
    .map((item) => ({
      text: item.str.trim(),
      x: item.transform[4],
      y: item.transform[5],
    }))
    .filter((item) => item.text.length > 0);

  if (positioned.length === 0) {
    return '';
  }

  positioned.sort((a, b) => {
    const yDiff = Math.abs(b.y - a.y);

    if (yDiff > 4) {
      return b.y - a.y;
    }

    return a.x - b.x;
  });

  const lines: Array<{ y: number; parts: Array<{ x: number; text: string }> }> = [];

  for (const item of positioned) {
    const lastLine = lines[lines.length - 1];

    if (!lastLine || Math.abs(lastLine.y - item.y) > 4) {
      lines.push({
        y: item.y,
        parts: [{ x: item.x, text: item.text }],
      });
      continue;
    }

    lastLine.parts.push({ x: item.x, text: item.text });
  }

  const lineTexts = lines.map((line) => {
    line.parts.sort((a, b) => a.x - b.x);

    let output = '';

    for (let index = 0; index < line.parts.length; index += 1) {
      const current = line.parts[index];
      const previous = line.parts[index - 1];

      if (index === 0) {
        output += current.text;
        continue;
      }

      const shouldAddSpace =
        previous &&
        !output.endsWith('-') &&
        !current.text.startsWith(',') &&
        !current.text.startsWith('.') &&
        !current.text.startsWith(';') &&
        !current.text.startsWith(':') &&
        !current.text.startsWith(')');

      output += shouldAddSpace ? ` ${current.text}` : current.text;
    }

    return output.trim();
  });

  return normalizeText(lineTexts.join('\n'));
}

async function resolveOutlineTitles(
  pdf: pdfjsLib.PDFDocumentProxy,
): Promise<Map<number, string>> {
  const outline = await pdf.getOutline();

  if (!outline || outline.length === 0) {
    return new Map();
  }

  const flattened = flattenOutline(outline as OutlineNodeLike[]);
  const entries: OutlinePageTitle[] = [];

  for (const node of flattened) {
    if (!node.title || !node.dest) {
      continue;
    }

    let destination: unknown[] | null = null;

    if (typeof node.dest === 'string') {
      destination = await pdf.getDestination(node.dest);
    } else if (Array.isArray(node.dest)) {
      destination = node.dest;
    }

    if (!destination || destination.length === 0) {
      continue;
    }

    const ref = destination[0];

    if (!isPdfRefLike(ref)) {
      continue;
    }

    const pageIndex = await pdf.getPageIndex(ref).catch(() => -1);

    if (pageIndex >= 0) {
      entries.push({
        pageNumber: pageIndex + 1,
        title: node.title.trim(),
      });
    }
  }

  entries.sort((a, b) => a.pageNumber - b.pageNumber);

  const pageTitleMap = new Map<number, string>();

  for (let index = 0; index < entries.length; index += 1) {
    const current = entries[index];
    const next = entries[index + 1];
    const endPage = next ? next.pageNumber - 1 : pdf.numPages;

    for (let pageNumber = current.pageNumber; pageNumber <= endPage; pageNumber += 1) {
      if (!pageTitleMap.has(pageNumber)) {
        pageTitleMap.set(pageNumber, current.title);
      }
    }
  }

  return pageTitleMap;
}

export async function importPdfDocument(file: File): Promise<Document> {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
  });

  const pdf = await loadingTask.promise;

  try {
    const pageLabels = await pdf.getPageLabels().catch(() => null);
    const outlineTitles = await resolveOutlineTitles(pdf);

    const sections: Document['sections'] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const pageText = extractOrderedPageText(textContent.items as TextItemLike[]);

      if (!pageText) {
        continue;
      }

      const pageLabel =
        pageLabels && pageLabels[pageNumber - 1]
          ? pageLabels[pageNumber - 1]
          : `Page ${pageNumber}`;

      const outlineTitle = outlineTitles.get(pageNumber);

      sections.push({
        id: `page-${pageNumber}`,
        title: `Page ${pageNumber}`,
        displayTitle: outlineTitle || pageLabel,
        text: pageText,
      });
    }

    if (sections.length === 0) {
      throw new Error('The PDF did not yield any readable text.');
    }

    const metadataResult = await pdf.getMetadata().catch(() => undefined);

    const info =
      metadataResult && 'info' in metadataResult ? metadataResult.info : undefined;

    const titleFromMetadata =
      info && 'Title' in info && typeof info.Title === 'string'
        ? info.Title
        : undefined;

    const authorFromMetadata =
      info && 'Author' in info && typeof info.Author === 'string'
        ? info.Author
        : undefined;

    const now = new Date().toISOString();

    return {
      id: createDocumentId(file.name),
      title:
        titleFromMetadata ||
        file.name.replace(/\.[^.]+$/, '') ||
        'Untitled PDF',
      author: authorFromMetadata,
      format: 'pdf',
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
    await loadingTask.destroy();
  }
}
