import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errors';
interface AsyncState<T> { data: T | null; loading: boolean; error: string | null; reload: () => void; }
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
  const [version, setVersion] = useState(0); const [data, setData] = useState<T | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => { let active = true; setLoading(true); setError(null); fn().then((result) => { if (active) setData(result); }).catch((reason: unknown) => { if (active) setError(getErrorMessage(reason)); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; // fn is intentionally driven by caller's deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);
  return { data, loading, error, reload };
}
