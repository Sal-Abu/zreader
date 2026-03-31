import { Link } from 'react-router-dom';
import type { Document } from '../../types/document';
import './DocumentCard.css';

type DocumentCardProps = {
  document: Document;
};

export default function DocumentCard({ document }: DocumentCardProps) {
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
        <Link to={`/library/${document.id}/read`}>Read</Link>
        <Link to={`/library/${document.id}/speed-read`}>Speed Read</Link>
      </div>
    </article>
  );
}
