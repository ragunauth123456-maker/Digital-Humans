import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded, signOut, openSignIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Digital Humans
        </Link>

        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : isSignedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                My Profile
              </Link>
              <Link
                to="/profile/create"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Create Digital Human
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {PUBLISHABLE_KEY ? (
                <button
                  onClick={() => openSignIn()}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </button>
              ) : (
                <Link
                  to="/sign-in"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
              )}
              <a
                href="#waitlist"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Join the Waitlist
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
