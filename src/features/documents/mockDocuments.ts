import type { Document } from '../../types/document';

const now = new Date().toISOString();

export const seedDocuments: Document[] = [
  {
    id: 'deep-work',
    title: 'Deep Work Notes',
    author: 'Sample Author',
    format: 'txt',
    description: 'A short productivity text used as sample reading material.',
    createdAt: now,
    updatedAt: now,
    sections: [
      {
        id: 'deep-work-1',
        title: 'What Deep Work Means',
        text: `Deep work is the ability to focus without distraction on a cognitively demanding task.
It lets you learn hard things quickly and produce better results in less time.`,
      },
      {
        id: 'deep-work-2',
        title: 'Why It Matters',
        text: `The modern world is filled with interruption. A person who can work with clarity and sustained focus
has a strong advantage in learning, writing, problem solving, and building useful products.`,
      },
    ],
  },
  {
    id: 'speed-reading-intro',
    title: 'Speed Reading Introduction',
    author: 'Sample Author',
    format: 'epub',
    description: 'A sample document about accelerated reading.',
    createdAt: now,
    updatedAt: now,
    sections: [
      {
        id: 'speed-reading-1',
        title: 'Introduction',
        text: `Rapid Serial Visual Presentation shows words or small chunks one at a time in a fixed position.
This reduces eye movement and can increase reading speed for some kinds of material.`,
      },
      {
        id: 'speed-reading-2',
        title: 'Limits',
        text: `Higher speed does not always mean better comprehension. Good tools should give users
control over pacing, pauses, chunk size, and navigation so they can adapt the experience to the text.`,
      },
    ],
  },
  {
    id: 'project-design',
    title: 'Project Design Draft',
    author: 'Sample Author',
    format: 'pdf',
    description: 'A sample design document for testing library and reading flows.',
    createdAt: now,
    updatedAt: now,
    sections: [
      {
        id: 'project-design-1',
        title: 'Overview',
        text: `This project aims to create a document-centric reading application.
Users should be able to read documents normally or switch into a speed reading mode.`,
      },
      {
        id: 'project-design-2',
        title: 'Core Requirement',
        text: `The same document record should power both reading modes.
That means the library, document details, reader, and RSVP engine all need a shared document model.`,
      },
    ],
  },
];
