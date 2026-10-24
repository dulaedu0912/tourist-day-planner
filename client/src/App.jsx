import HomePage from './pages/HomePage.jsx';
import AdminPage from './pages/AdminPage.jsx';

// Two pages, one bundle: /admin shows the admin panel, everything else the tourist site.
export default function App() {
  return window.location.pathname.startsWith('/admin') ? <AdminPage /> : <HomePage />;
}
