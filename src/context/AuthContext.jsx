import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    status: "loading",
    session: null,
  });

  const { user } = authState.session || {};

  useEffect(() => {
    // First check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        status: session ? "authenticated" : "unauthenticated",
        session,
      });
    });

    // Listen for future changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        status: session ? "authenticated" : "unauthenticated",
        session,
      });
    });

    // Cleanup listener when component unmounts
    return () => subscription?.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
