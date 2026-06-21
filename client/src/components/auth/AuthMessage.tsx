type AuthMessageProps = {
  message: string;
};

export default function AuthMessage({ message }: AuthMessageProps) {
  if (!message) return null;

  return <div className="alert alert-info py-2">{message}</div>;
}