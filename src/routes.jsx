import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import HomeUpload from './components/pages/HomeUpload.jsx';
import TryOnStudio from './components/pages/TryOnStudio.jsx';
import Closet from './components/pages/Closet.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeUpload /> },
      { path: '/studio', element: <TryOnStudio /> },
      { path: '/closet', element: <Closet /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
