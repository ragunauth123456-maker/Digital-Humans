import { useState, useEffect } from "react";

export default function HeroSection() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="hero"
      className="relative min-h-screen flex flex-col"
    >
      {/* Nav */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <a href="#hero" className="text-xl font-bold tracking-tight text-gray-900">
            Digital Humans
          </a>
          <a
            href="#waitlist"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            Join the Waitlist
          </a>
        </div>
      </nav>

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
              <a
                href="#waitlist"
                className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-lg"
              >
                Join the Waitlist
              </a>
              <a
                href="#what-is"
                className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
