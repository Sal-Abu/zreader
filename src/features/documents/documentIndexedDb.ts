import type { Document } from '../../types/document';
import { seedDocuments } from './mockDocuments';

const DATABASE_NAME = 'zreader-db';
const DATABASE_VERSION = 1;
const STORE_NAME = 'documents';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

function sortDocuments(documents: Document[]) {
  return [...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getAllDocumentsFromDb(): Promise<Document[]> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => {
      reject(new Error('Failed to load documents from IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve(sortDocuments((request.result as Document[]) ?? []));
    };
  });
}

export async function getDocumentFromDb(
  documentId: string,
): Promise<Document | undefined> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(documentId);

    request.onerror = () => {
      reject(new Error('Failed to load document from IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve(request.result as Document | undefined);
    };
  });
}

export async function putDocumentInDb(document: Document): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(document);

    request.onerror = () => {
      reject(new Error('Failed to save document to IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
}

export async function deleteDocumentFromDb(documentId: string): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(documentId);

    request.onerror = () => {
      reject(new Error('Failed to delete document from IndexedDB.'));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
}

export async function seedDocumentsInDb(): Promise<Document[]> {
  const existingDocuments = await getAllDocumentsFromDb();

  if (existingDocuments.length > 0) {
    return existingDocuments;
  }

  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    for (const document of seedDocuments) {
      store.put(document);
    }

    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(new Error('Failed to seed documents into IndexedDB.'));
  });

  return sortDocuments(seedDocuments);
}
