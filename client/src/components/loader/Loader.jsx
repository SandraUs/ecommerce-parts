import "./loader.css";

export const Loader = ({ label = "Загрузка..." }) => {
  return (
    <div className="loader" role="status" aria-live="polite" aria-busy="true">
      <span className="loader__spinner" />
      <span className="loader__label">{label}</span>
    </div>
  );
};

