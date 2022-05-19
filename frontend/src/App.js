import { Fragment, useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import { Navbar } from './layout';
import {
  SearchPage,
  ApartmentsPage,
  LoginPage,
  ApartmentDetailsPage,
} from './pages';
import { ProfilePage } from './pages/Profile';

const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user && pathname !== '/login') {
      navigate('/login');
    }
  }, [pathname, navigate, user]);

  return (
    <Fragment>
      {pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="apartments" element={<ApartmentsPage />} />
        <Route path="apartments/:id" element={<ApartmentDetailsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="search" />} />
      </Routes>
    </Fragment>
  );
};

export default App;
