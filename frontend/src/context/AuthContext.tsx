import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useAuth as useClerkAuth, useUser, type UserResource } from "@clerk/clerk-react";

interface AuthContextValue {
  user: UserResource | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  getAccessToken: (options?: { forceRefresh?: boolean }) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded: isAuthLoaded, getToken, signOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  const isLoading = !isAuthLoaded || !isUserLoaded;

  const getAccessToken = useCallback(async (options?: { forceRefresh?: boolean }) => {
    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const token = await getToken({ skipCache: options?.forceRefresh || attempt > 0 });
      if (token) {
        return token;
      }

      // Clerk token can be briefly unavailable immediately after route/auth transitions.
      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    return null;
  }, [getToken]);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signOut: handleSignOut,
      getAccessToken,
    }),
    [user, isLoading, handleSignOut, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
