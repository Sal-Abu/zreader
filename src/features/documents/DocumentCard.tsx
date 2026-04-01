import { Link } from 'react-router-dom';
import type { Document } from '../../types/document';
import './DocumentCard.css';

type DocumentCardProps = {
  document: Document;
};

export default function DocumentCard({ document }: DocumentCardProps) {
  const readLink = document.normalProgress?.sectionId
    ? `/library/${document.id}/read?section=${document.normalProgress.sectionId}`
    : `/library/${document.id}/read`;

  const speedReadLink = document.speedReadProgress?.sectionId
    ? `/library/${document.id}/speed-read?scope=section&section=${document.speedReadProgress.sectionId}`
    : `/library/${document.id}/speed-read?scope=document`;

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
      </div>
    </article>
  );
}
