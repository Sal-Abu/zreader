import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import HomePage from '../../pages/HomePage';
import ReaderPage from '../../pages/ReaderPage';
import LibraryPage from '../../pages/LibraryPage';
import SettingsPage from '../../pages/SettingsPage';

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
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
