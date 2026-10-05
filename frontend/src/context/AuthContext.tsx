import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login as loginRequest } from '../api/auth';
import type { Librarian } from '../types/models';
import type { LoginRequest } from '../types/api';
interface AuthValue { token: string | null; librarian: Librarian | null; isAuthenticated: boolean; login: (input: LoginRequest) => Promise<void>; logout: () => void; }
const AuthContext = createContext<AuthValue | undefined>(undefined);
const storedLibrarian = (): Librarian | null => { const raw = localStorage.getItem('shelflife_librarian'); if (!raw) return null; try { return JSON.parse(raw) as Librarian; } catch { return null; } };
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('shelflife_token'));
  const [librarian, setLibrarian] = useState<Librarian | null>(storedLibrarian);
  const value = useMemo<AuthValue>(() => ({ token, librarian, isAuthenticated: Boolean(token), login: async (input) => { const result = await loginRequest(input); localStorage.setItem('shelflife_token', result.token); localStorage.setItem('shelflife_librarian', JSON.stringify(result.librarian)); setToken(result.token); setLibrarian(result.librarian); }, logout: () => { localStorage.removeItem('shelflife_token'); localStorage.removeItem('shelflife_librarian'); setToken(null); setLibrarian(null); } }), [token, librarian]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthValue { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; }
