export type DocumentFormat = 'txt' | 'epub' | 'pdf';

export type DocumentSection = {
  id: string;
  title: string;
  text: string;
};

export type ReadingProgress = {
  sectionId?: string;
  tokenIndex?: number;
};

export type Document = {
  id: string;
  title: string;
  author?: string;
  format: DocumentFormat;
  description?: string;
  sections: DocumentSection[];
  createdAt: string;
  updatedAt: string;
  normalProgress?: ReadingProgress;
  speedReadProgress?: ReadingProgress;
};
