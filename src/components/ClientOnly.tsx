import { useEffect, useState, type ReactNode } from "react";

/** Renders children only on the client side. Prevents SSR hydration errors for
 *  components that depend on browser APIs (e.g. Clerk's SignIn/SignUp). */
export default function ClientOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return fallback ?? null;
  return <>{children}</>;
}
