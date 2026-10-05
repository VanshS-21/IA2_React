import type { ButtonHTMLAttributes, ReactNode } from 'react';
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; tone?: 'primary' | 'secondary' | 'quiet' | 'danger'; }
export function Button({ children, tone = 'primary', className = '', ...props }: Props): JSX.Element { return <button className={`button button-${tone} ${className}`} {...props}>{children}</button>; }
