# ZReader

Known dependency note:
EPUB import currently depends on epubjs 0.3.x, which triggers npm audit warnings through @xmldom/xmldom.
Current EPUB support is limited to local import and plain-text extraction.
Rich EPUB rendering is deferred pending dependency review.

ZReader is an early-stage, cross-platform reading application built around Rapid Serial Visual Presentation (RSVP). Its core premise is to allow users to import long-form documents—like PDFs, EPUBs, and text files—into a shared internal library. Once imported, users can seamlessly switch between a traditional document view for context-focused reading, and an RSVP speed-reading mode that flashes text one token at a time for rapid intake.

The project is currently in active MVP development. At this stage, the foundation is established with a working application shell, routing, a mock document library, and working prototypes for both the normal and RSVP reading flows. Critical features like real file uploads, local persistence, and actual document parsing are not yet implemented, with rich EPUB parsing specifically deferred pending a dependency review.

ZReader is being developed incrementally using a modern web stack consisting of React, TypeScript, Vite, and React Router. The current focus is on validating the core web-based reading experience and establishing the document model. Future planned additions include integrating real document import capabilities, adding a backend for account synchronization, and eventually using Capacitor to package the application for Android and iOS devices.

## Current status

The project is currently in active MVP development.

Completed so far:

- project environment setup
- GitHub repository setup
- Vite + React + TypeScript app scaffold
- cleaned starter app
- application shell and routing
- RSVP prototype
- document model with mock library data
- document detail page
- normal reading view
- document-backed speed-reading view
- TXT import
- EPUB import
- PDF import
- local persistence

