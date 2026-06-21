import { ReactNode } from 'react';

type AuthFormCardProps = {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  footer: ReactNode;
  children: ReactNode;
};

export default function AuthFormCard({
  title,
  onSubmit,
  submitText,
  footer,
  children,
}: AuthFormCardProps) {
  return (
    <div className="auth-wrap">
      <form className="card p-4 shadow-sm" onSubmit={onSubmit}>
        <h1 className="h4 mb-3">{title}</h1>

        {children}

        <button className="btn btn-primary w-100" type="submit">
          {submitText}
        </button>

        <div className="mt-3 small">{footer}</div>
      </form>
    </div>
  );
}