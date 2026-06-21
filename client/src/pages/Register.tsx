import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import AuthFormCard from '../components/auth/AuthFormCard';
import AuthInput from '../components/auth/AuthInput';
import AuthMessage from '../components/auth/AuthMessage';
import { MESSAGES } from '../constants/messages';
import { ROUTES } from '../constants/routes';
import { getErrorMessage } from '../utils/errors';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/auth/register', form);
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(getErrorMessage(error, MESSAGES.registrationFailed));
    }
  };

  return (
    <AuthFormCard
      title="Register"
      onSubmit={submit}
      submitText="Register"
      footer={<Link to={ROUTES.login}>Back to login</Link>}
    >
      <AuthInput
        placeholder="Name"
        value={form.name}
        autoComplete="name"
        onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
      />

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
        autoComplete="new-password"
        onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
      />

      <AuthMessage message={message} />
    </AuthFormCard>
  );
}