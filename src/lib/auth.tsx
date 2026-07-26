import { createContext, useContext, type ReactNode } from "react";
import {
  ClerkProvider,
  useUser as useClerkUser,
  useClerk as useClerkClerk,
} from "@clerk/clerk-react";

// Minimal user type for our auth context
export interface AuthUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

// Safe auth context
interface AuthContextValue {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: AuthUser | null;
  signOut: () => void;
  openSignIn: () => void;
}

const SafeAuthContext = createContext<AuthContextValue>({
  isSignedIn: false,
  isLoaded: true,
  user: null,
  signOut: () => {},
  openSignIn: () => {},
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!PUBLISHABLE_KEY) {
    return (
      <SafeAuthContext.Provider
        value={{ isSignedIn: false, isLoaded: true, user: null, signOut: () => {}, openSignIn: () => {} }}
      >
        {children}
      </SafeAuthContext.Provider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/profile/create"
    >
      <ClerkAuthBridge>{children}</ClerkAuthBridge>
    </ClerkProvider>
  );
}

/** Bridges Clerk auth into our safe context so components can use useAuth() uniformly */
function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, user } = useClerkUser();
  const clerk = useClerkClerk();

  const authUser: AuthUser | null = user
    ? {
        id: user.id,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
      }
    : null;

  return (
    <SafeAuthContext.Provider
      value={{
        isSignedIn: isSignedIn ?? false,
        isLoaded: isLoaded ?? false,
        user: authUser,
        signOut: () => clerk.signOut(),
        openSignIn: () => clerk.openSignIn(),
      }}
    >
      {children}
    </SafeAuthContext.Provider>
  );
}

/** Uniform auth hook — works whether or not Clerk is configured */
export function useAuth() {
  return useContext(SafeAuthContext);
}

/** Re-export Clerk components for use on auth pages (only used when Clerk is configured) */
export { SignIn, SignUp } from "@clerk/clerk-react";
