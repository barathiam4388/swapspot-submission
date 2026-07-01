import { createContext, useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export const AuthContext = createContext(null);

const storageKey = 'swapspot-auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : { token: null, user: null };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const user = await apiClient.get('/auth/me', auth.token);
        setAuth((current) => ({ ...current, user }));
      } catch (_error) {
        localStorage.removeItem(storageKey);
        setAuth({ token: null, user: null });
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [auth.token]);

  const saveAuth = (nextAuth) => {
    setAuth(nextAuth);
    localStorage.setItem(storageKey, JSON.stringify(nextAuth));
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: saveAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
