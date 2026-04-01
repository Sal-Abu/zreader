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
  const { getDocument, isReady } = useDocuments();

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

  const isSectionScope = scope === 'section' && currentSection;

  const sourceText = isSectionScope
    ? currentSection.text
    : getFullDocumentText(document);

  const tokens = tokenizeText(sourceText);

  return (
    <main style={{ display: 'grid', gap: '2rem' }}>
      <section style={{ display: 'grid', gap: '0.5rem', maxWidth: '800px' }}>
        <p style={{ margin: 0, color: '#555555' }}>
          {document.format.toUpperCase()}
        </p>
        <h1 style={{ margin: 0 }}>{document.title}</h1>
        <p style={{ margin: 0 }}>
          {isSectionScope
            ? `Speed reading section: ${currentSection?.title ?? 'Unknown section'}`
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

      <RsvpReader tokens={tokens} />
    </main>
  );
}
