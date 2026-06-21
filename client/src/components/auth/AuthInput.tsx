type AuthInputProps = {
  type?: React.HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
};

export default function AuthInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
}: AuthInputProps) {
  return (
    <input
      className="form-control mb-2"
      type={type}
      placeholder={placeholder}
      value={value}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}