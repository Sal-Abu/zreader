import type { Document } from '../../types/document';

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

export async function importTextDocument(file: File): Promise<Document> {
  const text = (await file.text()).replace(/\r\n/g, '\n').trim();

  if (!text) {
    throw new Error('The selected text file is empty.');
  }

  const now = new Date().toISOString();
  const title = file.name.replace(/\.[^.]+$/, '') || 'Untitled document';

  return {
    id: createDocumentId(file.name),
    title,
    author: undefined,
    format: 'txt',
    description: `Imported from local file: ${file.name}`,
    createdAt: now,
    updatedAt: now,
    normalProgress: {
      sectionId: 'section-1',
    },
    speedReadProgress: undefined,
    sections: [
      {
        id: 'section-1',
        title: 'Document',
        text,
      },
    ],
  };
}
