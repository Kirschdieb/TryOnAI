import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Landing from './components/pages/NewLanding.jsx';
import HomeUpload from './components/pages/HomeUpload.jsx';
import TryOnStudio from './components/pages/TryOnStudio.jsx';
import Closet from './components/pages/Closet.jsx';
import ProfilePage from './components/pages/Profile.jsx';
import About from './components/pages/About.jsx';
import Browse from './components/pages/Browse.jsx';

import Dashboard from './components/pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
      { path: '/try-on', element: <HomeUpload /> },
      { path: '/studio', element: <TryOnStudio /> },
      { path: '/closet', element: <Closet /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/about', element: <About /> },
      { path: '/browse', element: <Browse /> },
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
