import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { isAuthed } from '../utils/auth';

type ProtectedRouteProps = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthed()) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return children;
}