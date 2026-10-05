export function Logo() {
  return (
    <span className="logo">
      <svg className="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <rect width="40" height="40" rx="5" fill="var(--indigo)" />
        <path d="M12 40V19a8 8 0 0 1 16 0v21z" fill="var(--pink)" />
        <rect y="33" width="40" height="7" fill="var(--indigo-deep)" opacity=".55" />
        <circle cx="24" cy="26" r="1.8" fill="var(--yellow)" />
      </svg>
      <span className="logo__words">
        <span className="logo__small">Tu nuevo</span>
        <span className="logo__big">Hogar</span>
      </span>
    </span>
  )
}
