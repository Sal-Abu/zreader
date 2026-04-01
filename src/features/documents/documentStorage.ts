import type { Document } from '../../types/document';
import { seedDocuments } from './mockDocuments';

const STORAGE_KEY = 'zreader.documents';

function sortDocuments(documents: Document[]) {
  return [...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function loadDocuments(): Document[] {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Document[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return sortDocuments(parsedValue);
  } catch {
    return [];
  }
}

export function saveDocuments(documents: Document[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export function initializeDocuments() {
  const existingDocuments = loadDocuments();

  if (existingDocuments.length > 0) {
    return existingDocuments;
  }

  saveDocuments(seedDocuments);

  return seedDocuments;
}

export function getDocumentById(documentId: string) {
  return loadDocuments().find((document) => document.id === documentId);
}

export function saveDocument(updatedDocument: Document) {
  const documents = loadDocuments();

  const nextDocuments = documents.some((document) => document.id === updatedDocument.id)
    ? documents.map((document) =>
        document.id === updatedDocument.id ? updatedDocument : document,
      )
    : [...documents, updatedDocument];

  saveDocuments(sortDocuments(nextDocuments));
}

export function deleteDocument(documentId: string) {
  const documents = loadDocuments().filter((document) => document.id !== documentId);

  saveDocuments(documents);
}
