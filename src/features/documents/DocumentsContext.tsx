import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Document } from '../../types/document';
import {
  deleteDocumentFromDb,
  getDocumentFromDb,
  getAllDocumentsFromDb,
  putDocumentInDb,
  seedDocumentsInDb,
} from './documentIndexedDb';

type DocumentsContextValue = {
  documents: Document[];
  addDocument: (document: Document) => Promise<void>;
  getDocument: (documentId: string) => Document | undefined;
  isReady: boolean;
  removeDocument: (documentId: string) => Promise<void>;
  updateDocument: (document: Document) => Promise<void>;
};

const DocumentsContext = createContext<DocumentsContextValue | undefined>(undefined);

type DocumentsProviderProps = {
  children: ReactNode;
};

function sortDocuments(documents: Document[]) {
  return [...documents].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function DocumentsProvider({ children }: DocumentsProviderProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      const seededDocuments = await seedDocumentsInDb();

      if (!isMounted) {
        return;
      }

      setDocuments(sortDocuments(seededDocuments));
      setIsReady(true);
    }

    initialize().catch((error) => {
      console.error(error);
      if (isMounted) {
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function getDocument(documentId: string) {
    return documents.find((document) => document.id === documentId);
  }

  async function addDocument(document: Document) {
    await putDocumentInDb(document);

    setDocuments((previousDocuments) =>
      sortDocuments([...previousDocuments, document]),
    );
  }

  async function updateDocument(document: Document) {
    await putDocumentInDb(document);

    setDocuments((previousDocuments) => {
      const exists = previousDocuments.some(
        (previousDocument) => previousDocument.id === document.id,
      );

      const nextDocuments = exists
        ? previousDocuments.map((previousDocument) =>
            previousDocument.id === document.id ? document : previousDocument,
          )
        : [...previousDocuments, document];

      return sortDocuments(nextDocuments);
    });
  }

  async function removeDocument(documentId: string) {
    await deleteDocumentFromDb(documentId);

    setDocuments((previousDocuments) =>
      previousDocuments.filter((document) => document.id !== documentId),
    );
  }

  const value = useMemo(
    () => ({
      documents,
      addDocument,
      getDocument,
      isReady,
      removeDocument,
      updateDocument,
    }),
    [documents, isReady],
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
