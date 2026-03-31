function StatusView({
  title,
  text,
  actionLabel,
  onAction,
  tone = 'default',
  compact = false,
}) {
  return (
    <div
      className={`status-view ${compact ? 'status-view-compact' : ''} ${tone === 'error' ? 'status-view-error' : ''}`}
    >
      <p className="eyebrow">{tone === 'error' ? 'Something happened' : 'Workspace state'}</p>
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && onAction ? (
        <button type="button" className="button button-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default StatusView
