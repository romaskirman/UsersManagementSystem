import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES } from './constants/routes';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import UsersPage from './pages/UsersPage';

export default function App() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.login} replace />} />
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.register} element={<Register />} />
      <Route path={ROUTES.users} element={<Verify />} />
      <Route
        path={ROUTES.app}
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}