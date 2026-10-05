import { Button } from './Button';
export function ErrorMessage({ message, retry }: { message: string; retry?: () => void }): JSX.Element { return <div className="error-message" role="alert" aria-live="polite"><strong>Couldn’t load this view.</strong><span>{message}</span>{retry && <Button tone="secondary" onClick={retry}>Try again</Button>}</div>; }
