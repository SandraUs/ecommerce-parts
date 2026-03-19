export const AuthField = ({ className, label, error, children }) => {
  return (
    <div className={className}>
      <label>{label}</label>
      {children}
      {error ? <span className={error.className}>{error.message}</span> : null}
    </div>
  );
};

