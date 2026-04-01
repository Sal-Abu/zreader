import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useDocuments } from '../features/documents/DocumentsContext';
import {
  getSectionByIndex,
  getSectionIndexById,
} from '../features/documents/documentSelectors';
import SectionNavigator from '../features/documents/SectionNavigator';

export default function DocumentReadPage() {
  const { documentId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { getDocument, updateDocument } = useDocuments();

  const document = getDocument(documentId);

  const sectionId =
    searchParams.get('section') ?? document?.normalProgress?.sectionId ?? undefined;

  const currentSectionIndex = document
    ? getSectionIndexById(document, sectionId)
    : 0;

  const currentSection = document
    ? getSectionByIndex(document, currentSectionIndex)
    : undefined;

  useEffect(() => {
    if (!document || !currentSection) {
      return;
    }

    if (document.normalProgress?.sectionId === currentSection.id) {
      return;
    }

    updateDocument({
      ...document,
      updatedAt: new Date().toISOString(),
      normalProgress: {
        sectionId: currentSection.id,
      },
    });
  }, [document, currentSection, updateDocument]);

  if (!document) {
    return (
      <main>
        <h1>Document not found</h1>
        <p>The requested document does not exist.</p>
      </main>
    );
  }

  if (!currentSection) {
    return (
      <main>
        <h1>No section available</h1>
        <p>This document does not contain readable sections.</p>
      </main>
    );
  }

  return (
    <main style={{ display: 'grid', gap: '2rem', maxWidth: '800px' }}>
      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0, color: '#555555' }}>
          {document.format.toUpperCase()}
        </p>
        <h1 style={{ margin: 0 }}>{document.title}</h1>
        <p style={{ margin: 0 }}>Normal reading view</p>
      </section>

      <SectionNavigator
        document={document}
        currentSectionIndex={currentSectionIndex}
        basePath={`/library/${document.id}/read`}
      />

      <article style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>{currentSection.title}</h2>
        {currentSection.text.split('\n').map((paragraph, index) => (
          <p key={`${currentSection.id}-${index}`} style={{ margin: 0 }}>
            {paragraph}
          </p>
        ))}
      </article>

      <section style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link
          to={`/library/${document.id}/speed-read?scope=section&section=${currentSection.id}`}
        >
          Speed read this section
        </Link>
        <Link to={`/library/${document.id}/speed-read?scope=document`}>
          Speed read full document
        </Link>
        <Link to={`/library/${document.id}`}>Back to details</Link>
      </section>
    </main>
  );
}
