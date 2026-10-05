import { Link } from 'react-router-dom';
export function NotFoundPage(): JSX.Element { return <section className="page narrow-page empty-page"><p className="kicker">404</p><h1>This shelf is empty.</h1><p>The page you were looking for isn’t in the catalog.</p><Link className="button button-primary" to="/">Return to catalog</Link></section>; }
