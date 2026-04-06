import { Link } from 'react-router-dom';
import type { Document } from '../../types/document';
import { useDocuments } from './DocumentsContext';
import './DocumentCard.css';

type DocumentCardProps = {
  document: Document;
};

function getSectionLabel(document: Document, sectionId?: string) {
  if (!sectionId) {
    return undefined;
  }

  const section = document.sections.find((item) => item.id === sectionId);

  if (!section) {
    return sectionId;
  }

  return section.displayTitle || section.chapterTitle || section.title;
}

function formatProgressLabel(document: Document) {
  const speedToken = document.speedReadProgress?.tokenIndex;
  const speedSectionLabel = getSectionLabel(
    document,
    document.speedReadProgress?.sectionId,
  );

  if (typeof speedToken === 'number' && speedToken > 0) {
    if (speedSectionLabel) {
      return `Speed read: ${speedSectionLabel}, token ${speedToken + 1}`;
    }

    return `Speed read progress: token ${speedToken + 1}`;
  }

  const normalSectionLabel = getSectionLabel(
    document,
    document.normalProgress?.sectionId,
  );

  if (normalSectionLabel) {
    return `Last read: ${normalSectionLabel}`;
  }

  return 'No reading progress yet';
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const { removeDocument } = useDocuments();

  const readLink = document.normalProgress?.sectionId
    ? `/library/${document.id}/read?section=${document.normalProgress.sectionId}`
    : `/library/${document.id}/read`;

  const speedReadLink = document.speedReadProgress?.sectionId
    ? `/library/${document.id}/speed-read?scope=section&section=${document.speedReadProgress.sectionId}`
    : `/library/${document.id}/speed-read?scope=document`;

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${document.title}" from your local library?`,
    );

    if (!confirmed) {
      return;
    }

    await removeDocument(document.id);
  }

  return (
    <article className="document-card">
      <div className="document-card__body">
        <p className="document-card__format">{document.format.toUpperCase()}</p>
        <h2 className="document-card__title">{document.title}</h2>
        {document.author ? (
          <p className="document-card__author">By {document.author}</p>
        ) : null}
        {document.description ? (
          <p className="document-card__description">{document.description}</p>
        ) : null}
        <p className="document-card__progress">{formatProgressLabel(document)}</p>
      </div>

      <div className="document-card__actions">
        <Link to={`/library/${document.id}`}>Details</Link>
        <Link to={readLink}>Read</Link>
        <Link to={speedReadLink}>Speed Read</Link>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}
