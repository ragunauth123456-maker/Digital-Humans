import { Link } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import NavBar from "~/components/NavBar";

export default function HeroSection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header id="hero" className="relative min-h-screen flex flex-col">
      <NavBar />

      {/* Hero content */}
      <div className="flex flex-1 items-center">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 w-full">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                Early Access — Join the waitlist
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Your Knowledge. Your Experience.{" "}
              <span className="text-indigo-600">Working Forever.</span>
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
              The world&apos;s first marketplace where professionals create,
              license, and sell AI representations of their expertise.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!isLoaded ? (
                <div className="h-14 w-56 animate-pulse rounded-xl bg-gray-100" />
              ) : isSignedIn ? (
                <>
                  <Link
                    to="/profile/create"
                    className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-lg"
                  >
                    Create Your Digital Human
                  </Link>
                  <Link
                    to="/browse"
                    className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    Browse Digital Humans <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href="#what-is"
                    className="text-base font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Learn more
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="#waitlist"
                    className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-lg"
                  >
                    Join the Waitlist
                  </a>
                  <Link
                    to="/browse"
                    className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    Browse Digital Humans <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    to="/sign-in"
                    className="text-base font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
