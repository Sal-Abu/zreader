# ZReader

ZReader is a cross-platform reading application focused on **Rapid Serial Visual Presentation (RSVP)**. It is being built to let users import long-form documents such as PDFs, EPUBs, and text files, then read them either in a normal document view or in a speed-reading mode.

The current version is an early foundation build. It already includes a working React application shell, routing, a mock document library, a normal reading flow, and an RSVP reading prototype.

## Project goals

The product is being designed around a simple idea:

- import a document once
- store it as a shared internal document model
- allow the user to open that same document in either:
  - a normal reading interface
  - an RSVP speed-reading interface

This avoids treating speed reading as a disconnected text widget and instead makes it part of a real document-reading workflow.

## Current status

The project is currently in active MVP development.

Completed so far:

- project environment setup
- GitHub repository setup
- Vite + React + TypeScript app scaffold
- cleaned starter app
- application shell and routing
- pasted-text RSVP prototype
- document model with mock library data
- document detail page
- normal reading view
- document-backed speed-reading view

Not yet implemented:

- real file uploads
- TXT import
- EPUB import
- PDF import
- local persistence
- backend sync
- Android packaging
- iOS packaging
- user accounts
- subscriptions

## Core product vision

ZReader is intended to support two reading modes for the same document.

### Normal reading mode

This mode presents the document in a familiar reading layout. It is meant for browsing, context, and slower comprehension-focused reading.

### RSVP speed-reading mode

This mode presents text one token at a time at a user-controlled pace. It is meant for faster intake, experimentation, and alternate reading workflows.

Both modes should eventually use the same document source, progress model, and library entry.

## Tech stack

Current stack:

- **React**
- **TypeScript**
- **Vite**
- **React Router**

Planned additions:

- **Capacitor** for Android and iOS packaging
- a document parsing layer for TXT, EPUB, and PDF support
- local persistence for saved documents and reading progress
- a backend later for sync and account support

## Development philosophy

This project is being built incrementally.

The approach is:

1. build a working web foundation first
2. validate the core reading experience
3. introduce a proper document model
4. add real document import
5. add persistence
6. package for mobile later

This keeps the codebase stable and avoids mixing too many unfinished systems at once.

## Project structure

Current source structure:

```text
src/
  app/
    router/
  components/
    layout/
    ui/
  features/
    documents/
    rsvp/
    settings/
    sessions/
  lib/
  pages/
  styles/
  types/
