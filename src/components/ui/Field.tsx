type FieldProps = {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email";
  autoComplete?: string;
};

export function Field({
  label,
  name,
  value,
  error,
  onChange,
  multiline = false,
  placeholder = "",
  required = false,
  type = "text",
  autoComplete,
}: FieldProps) {
  const baseStyles =
    "w-full px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--muted)] transition-colors duration-[var(--dur-fast)] focus:outline-none focus:border-[var(--accent)]";

  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={name}
        className="text-sm font-medium text-[var(--text)]"
      >
        {label}
        {required && <span className="text-[var(--accent)]"> *</span>}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          rows={5}
          autoComplete={autoComplete}
          className={`${baseStyles} resize-none ${error ? "border-[var(--accent)]" : ""}`}
        />
      ) : (
        <input
          type={type}
          autoComplete={autoComplete}
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`${baseStyles} ${error ? "border-[var(--accent)]" : ""}`}
        />
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-[var(--accent)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
