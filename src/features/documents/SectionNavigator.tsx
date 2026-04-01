import { Link } from 'react-router-dom';
import type { Document } from '../../types/document';
import './SectionNavigator.css';

type SectionNavigatorProps = {
  document: Document;
  currentSectionIndex: number;
  basePath: string;
};

export default function SectionNavigator({
  document,
  currentSectionIndex,
  basePath,
}: SectionNavigatorProps) {
  const hasPrevious = currentSectionIndex > 0;
  const hasNext = currentSectionIndex < document.sections.length - 1;

  const previousSection = hasPrevious
    ? document.sections[currentSectionIndex - 1]
    : undefined;

  const nextSection = hasNext
    ? document.sections[currentSectionIndex + 1]
    : undefined;

  return (
    <section className="section-navigator">
      <p className="section-navigator__status">
        Section {currentSectionIndex + 1} of {document.sections.length}
      </p>

      <div className="section-navigator__actions">
        {previousSection ? (
          <Link to={`${basePath}?section=${previousSection.id}`}>Previous</Link>
        ) : (
          <span className="section-navigator__disabled">Previous</span>
        )}

        {nextSection ? (
          <Link to={`${basePath}?section=${nextSection.id}`}>Next</Link>
        ) : (
          <span className="section-navigator__disabled">Next</span>
        )}
      </div>
    </section>
  );
}
