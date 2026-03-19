import { useEffect } from "react";

export const ConfirmDialog = ({
  open,
  title = "Подтверждение",
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  danger = false,
  disabled = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) onCancel?.();
  };

  return (
    <div className="cd-backdrop" role="presentation" onMouseDown={handleBackdropMouseDown}>
      <div
        className="cd-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cd-title"
        aria-describedby={description ? "cd-desc" : undefined}
      >
        <div className="cd-head">
          <div className="cd-title" id="cd-title">
            {title}
          </div>
          <button type="button" className="cd-close" onClick={onCancel} aria-label="Закрыть" />
        </div>

        {description ? (
          <div className="cd-desc" id="cd-desc">
            {description}
          </div>
        ) : null}

        <div className="cd-actions">
          <button type="button" className="cd-btn cd-secondary" onClick={onCancel} disabled={disabled}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`cd-btn ${danger ? "cd-danger" : "cd-primary"}`}
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

