import type { Document, DocumentSection } from '../../types/document';

export function getSectionIndexById(
  document: Document,
  sectionId: string | undefined,
): number {
  if (!sectionId) {
    return 0;
  }

  const index = document.sections.findIndex((section) => section.id === sectionId);

  return index >= 0 ? index : 0;
}

export function getSectionByIndex(
  document: Document,
  index: number,
): DocumentSection | undefined {
  return document.sections[index];
}

export function getFullDocumentText(document: Document): string {
  return document.sections.map((section) => section.text).join('\n\n');
}
