import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import HomePage from '../../pages/HomePage';
import ReaderPage from '../../pages/ReaderPage';
import LibraryPage from '../../pages/LibraryPage';
import SettingsPage from '../../pages/SettingsPage';
import DocumentDetailPage from '../../pages/DocumentDetailPage';
import DocumentReadPage from '../../pages/DocumentReadPage';
import DocumentSpeedReadPage from '../../pages/DocumentSpeedReadPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'reader',
        element: <ReaderPage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'library/:documentId',
        element: <DocumentDetailPage />,
      },
      {
        path: 'library/:documentId/read',
        element: <DocumentReadPage />,
      },
      {
        path: 'library/:documentId/speed-read',
        element: <DocumentSpeedReadPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
