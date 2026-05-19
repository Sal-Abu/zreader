import { useCallback, useMemo, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import RsvpReader from '../features/rsvp/RsvpReader';
import { useDocuments } from '../features/documents/DocumentsContext';
import {
  getFullDocumentText,
  getSectionByIndex,
  getSectionIndexById,
} from '../features/documents/documentSelectors';
import { tokenizeText } from '../features/rsvp/tokenizeText';

export default function DocumentSpeedReadPage() {
  const { documentId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const { getDocument, isReady, updateDocument } = useDocuments();

  const document = getDocument(documentId);

  const scope = searchParams.get('scope') ?? 'document';
  const sectionId =
    searchParams.get('section') ?? document?.speedReadProgress?.sectionId ?? undefined;

  const currentSectionIndex = document
    ? getSectionIndexById(document, sectionId)
    : 0;

  const currentSection = document
    ? getSectionByIndex(document, currentSectionIndex)
    : undefined;

  const isSectionScope = scope === 'section' && !!currentSection;

  const sourceText =
    document && isSectionScope && currentSection
      ? currentSection.text
      : document
        ? getFullDocumentText(document)
        : '';

  const tokens = useMemo(() => tokenizeText(sourceText), [sourceText]);

  const initialTokenIndexRef = useRef<number | null>(null);

  if (initialTokenIndexRef.current === null) {
    initialTokenIndexRef.current = document?.speedReadProgress?.tokenIndex ?? 0;
  }

  const resumeLabel =
    typeof document?.speedReadProgress?.tokenIndex === 'number' &&
    document.speedReadProgress.tokenIndex > 0
      ? `Resuming at token ${document.speedReadProgress.tokenIndex + 1}`
      : undefined;

  const handleProgressChange = useCallback(
    (tokenIndex: number) => {
      if (!document) {
        return;
      }

      const nextSectionId = isSectionScope ? currentSection?.id : undefined;
      const currentSavedTokenIndex = document.speedReadProgress?.tokenIndex;
      const currentSavedSectionId = document.speedReadProgress?.sectionId;

      if (
        currentSavedTokenIndex === tokenIndex &&
        currentSavedSectionId === nextSectionId
      ) {
        return;
      }

      void updateDocument({
        ...document,
        updatedAt: new Date().toISOString(),
        speedReadProgress: {
          sectionId: nextSectionId,
          tokenIndex,
          updatedAt: new Date().toISOString(),
        },
      });
    },
    [currentSection?.id, document, isSectionScope, updateDocument],
  );

  if (!isReady) {
    return (
      <main>
        <h1>Loading document...</h1>
      </main>
    );
  }

  if (!document) {
    return (
      <main>
        <h1>Document not found</h1>
        <p>The requested document does not exist.</p>
      </main>
    );
  }

  return (
    <main style={{ display: 'grid', gap: '2rem' }}>
      <section style={{ display: 'grid', gap: '0.5rem', maxWidth: '800px' }}>
        <p style={{ margin: 0, color: '#555555' }}>
          {document.format.toUpperCase()}
        </p>
        <h1 style={{ margin: 0 }}>{document.title}</h1>
        <p style={{ margin: 0 }}>
          {isSectionScope
            ? `Speed reading section: ${
                currentSection?.displayTitle ||
                currentSection?.chapterTitle ||
                currentSection?.title ||
                'Unknown section'
              }`
            : 'Speed reading full document'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to={
              isSectionScope && currentSection
                ? `/library/${document.id}/read?section=${currentSection.id}`
                : `/library/${document.id}/read`
            }
          >
            Read normally
          </Link>
          <Link to={`/library/${document.id}`}>Back to details</Link>
        </div>
      </section>

      <RsvpReader
        tokens={tokens}
        initialTokenIndex={initialTokenIndexRef.current ?? 0}
        onProgressChange={handleProgressChange}
        resumeLabel={resumeLabel}
      />
    </main>
  );
}
