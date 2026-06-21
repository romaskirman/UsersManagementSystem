import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import AuthFormCard from '../components/auth/AuthFormCard';
import AuthInput from '../components/auth/AuthInput';
import AuthMessage from '../components/auth/AuthMessage';
import { MESSAGES } from '../constants/messages';
import { ROUTES } from '../constants/routes';
import { clearToken, setToken } from '../utils/auth';
import { getErrorMessage, getErrorStatus } from '../utils/errors';
import { isRightsLostError } from '../utils/users';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get('verified') === '1') {
      setMessage(MESSAGES.emailVerified);
      return;
    }

    if (params.get('reason') === 'rights') {
      setMessage(MESSAGES.rightsLost);
      return;
    }

    setMessage('');
  }, [location.search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/auth/login', form);
      setToken(response.data.token);
      navigate(ROUTES.app, { replace: true });
    } catch (error: any) {
      clearToken();

      const status = getErrorStatus(error);
      const fallback = isRightsLostError(status, error?.response?.data?.message)
        ? MESSAGES.rightsLost
        : MESSAGES.loginFailed;

      setMessage(getErrorMessage(error, fallback));
    }
  };

  return (
    <AuthFormCard
      title="Login"
      onSubmit={submit}
      submitText="Login"
      footer={<Link to={ROUTES.register}>Register</Link>}
    >
      <AuthInput
        type="email"
        placeholder="Email"
        value={form.email}
        autoComplete="email"
        onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
      />

      <AuthInput
        type="password"
        placeholder="Password"
        value={form.password}
        autoComplete="current-password"
        onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
      />

      <AuthMessage message={message} />
    </AuthFormCard>
  );
}