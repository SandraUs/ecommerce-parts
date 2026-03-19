export const AuthPage = ({
  pageClassName,
  cardClassName,
  titleClassName,
  title,
  formClassName,
  onSubmit,
  children,
  footer,
}) => {
  return (
    <div className={pageClassName}>
      <div className={cardClassName}>
        <h1 className={titleClassName}>{title}</h1>
        <form className={formClassName} onSubmit={onSubmit}>
          {children}
        </form>
        {footer}
      </div>
    </div>
  );
};

