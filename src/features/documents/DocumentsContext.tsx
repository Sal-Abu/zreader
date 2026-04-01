import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Document } from '../../types/document';
import {
  deleteDocument,
  initializeDocuments,
  saveDocument,
} from './documentStorage';

type DocumentsContextValue = {
  documents: Document[];
  getDocument: (documentId: string) => Document | undefined;
  removeDocument: (documentId: string) => void;
  updateDocument: (document: Document) => void;
};

const DocumentsContext = createContext<DocumentsContextValue | undefined>(undefined);

type DocumentsProviderProps = {
  children: ReactNode;
};

export function DocumentsProvider({ children }: DocumentsProviderProps) {
  const [documents, setDocuments] = useState<Document[]>(() => initializeDocuments());

  function getDocument(documentId: string) {
    return documents.find((document) => document.id === documentId);
  }

  function updateDocument(document: Document) {
    saveDocument(document);

    setDocuments((previousDocuments) => {
      const exists = previousDocuments.some(
        (previousDocument) => previousDocument.id === document.id,
      );

      const nextDocuments = exists
        ? previousDocuments.map((previousDocument) =>
            previousDocument.id === document.id ? document : previousDocument,
          )
        : [...previousDocuments, document];

      return [...nextDocuments].sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt),
      );
    });
  }

  function removeDocument(documentId: string) {
    deleteDocument(documentId);
    setDocuments((previousDocuments) =>
      previousDocuments.filter((document) => document.id !== documentId),
    );
  }

  const value = useMemo(
    () => ({
      documents,
      getDocument,
      removeDocument,
      updateDocument,
    }),
    [documents],
  );

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }

  return context;
}
