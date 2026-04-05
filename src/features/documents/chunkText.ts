import type { DocumentSection } from '../../types/document';

type ChunkTextOptions = {
  chunkSize?: number;
  titlePrefix?: string;
};

export function chunkTextIntoSections(
  text: string,
  options: ChunkTextOptions = {},
): DocumentSection[] {
  const { chunkSize = 3500, titlePrefix = 'Section' } = options;

  const normalizedText = text.replace(/\r\n/g, '\n').trim();

  if (!normalizedText) {
    return [];
  }

  const paragraphs = normalizedText
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return [];
  }

  const sections: DocumentSection[] = [];
  let currentText = '';
  let currentIndex = 1;

  for (const paragraph of paragraphs) {
    const nextCandidate = currentText
      ? `${currentText}\n\n${paragraph}`
      : paragraph;

    if (nextCandidate.length > chunkSize && currentText) {
      sections.push({
        id: `section-${currentIndex}`,
        title: `${titlePrefix} ${currentIndex}`,
        text: currentText,
      });

      currentIndex += 1;
      currentText = paragraph;
    } else {
      currentText = nextCandidate;
    }
  }

  if (currentText) {
    sections.push({
      id: `section-${currentIndex}`,
      title: `${titlePrefix} ${currentIndex}`,
      text: currentText,
    });
  }

  return sections;
}
