import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { MESSAGES } from '../constants/messages';
import { getErrorMessage } from '../utils/errors';

export default function Verify() {
  const [message, setMessage] = useState('Verifying...');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = new URLSearchParams(window.location.search).get('token') || '';

      if (!token) {
        setMessage(MESSAGES.missingVerificationToken);
        setOk(false);
        return;
      }

      try {
        const response = await api.get('/auth/verify-email', { params: { token } });
        setMessage(response.data.message || 'Email verified');
        setOk(true);
      } catch (error: any) {
        setMessage(getErrorMessage(error, MESSAGES.verificationFailed));
        setOk(false);
      }
    };

    verify();
  }, []);

  return (
    <div className="auth-wrap">
      <div className="card p-4 shadow-sm">
        <h1 className="h4 mb-3">Verify email</h1>
        <div className={`alert ${ok ? 'alert-success' : 'alert-info'} py-2`}>
          {message}
        </div>
      </div>
    </div>
  );
}