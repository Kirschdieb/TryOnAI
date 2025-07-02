import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Landing from './components/pages/NewLanding.jsx';
import HomeUpload from './components/pages/HomeUpload.jsx';
import TryOnStudio from './components/pages/TryOnStudio.jsx';
import Closet from './components/pages/Closet.jsx';
import ProfilePage from './components/pages/Profile.jsx';
import About from './components/pages/About.jsx';
import Browse from './components/pages/Browse.jsx';
import FAQ from './components/pages/FAQ.jsx';
import Contact from './components/pages/Contact.jsx';
import Impressum from './components/pages/Impressum.jsx';
import Datenschutz from './components/pages/Datenschutz.jsx';
import AGB from './components/pages/AGB.jsx';

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
      { path: '/faq', element: <FAQ /> },
      { path: '/contact', element: <Contact /> },
      { path: '/impressum', element: <Impressum /> },
      { path: '/datenschutz', element: <Datenschutz /> },
      { path: '/agb', element: <AGB /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
