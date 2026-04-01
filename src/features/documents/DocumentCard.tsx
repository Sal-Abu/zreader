import { Link } from 'react-router-dom';
import type { Document } from '../../types/document';
import { useDocuments } from './DocumentsContext';
import './DocumentCard.css';

type DocumentCardProps = {
  document: Document;
};

export default function DocumentCard({ document }: DocumentCardProps) {
  const { removeDocument } = useDocuments();

  const readLink = document.normalProgress?.sectionId
    ? `/library/${document.id}/read?section=${document.normalProgress.sectionId}`
    : `/library/${document.id}/read`;

  const speedReadLink = document.speedReadProgress?.sectionId
    ? `/library/${document.id}/speed-read?scope=section&section=${document.speedReadProgress.sectionId}`
    : `/library/${document.id}/speed-read?scope=document`;

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${document.title}" from your local library?`,
    );

    if (!confirmed) {
      return;
    }

    removeDocument(document.id);
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

