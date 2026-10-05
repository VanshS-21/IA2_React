export function Spinner({ label = 'Loading' }: { label?: string }): JSX.Element { return <span className="spinner" aria-label={label} role="status"><span className="sr-only">{label}</span></span>; }
