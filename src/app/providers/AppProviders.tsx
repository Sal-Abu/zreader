import type { ReactNode } from 'react';
import { DocumentsProvider } from '../../features/documents/DocumentsContext';

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return <DocumentsProvider>{children}</DocumentsProvider>;
}
