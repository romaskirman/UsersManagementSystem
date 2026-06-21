import { jwtDecode } from 'jwt-decode';
import { ROUTES } from '../constants/routes';

type JwtPayload = {
  sub?: string;
  email?: string;
};

const TOKEN_KEY = 'token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthed() {
  return Boolean(getToken());
}

export function getCurrentUserId() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub || null;
  } catch {
    return null;
  }
}

export function getLoginPathWithRightsReason() {
  return `${ROUTES.login}?reason=rights`;
}