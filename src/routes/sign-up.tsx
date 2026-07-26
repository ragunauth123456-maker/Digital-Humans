import { createFileRoute, Link } from "@tanstack/react-router";
import { SignUp } from "~/lib/auth";
import ClientOnly from "~/components/ClientOnly";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
            Digital Humans
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join Digital Humans and create your AI representation
            </p>
          </div>

          {PUBLISHABLE_KEY ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <ClientOnly fallback={<div className="py-12 text-center text-sm text-gray-500">Loading sign-up…</div>}>
                <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                fallbackRedirectUrl="/profile/create"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0 w-full",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton:
                      "rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors",
                    formButtonPrimary:
                      "rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all w-full",
                    formFieldInput:
                      "rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition w-full",
                    formFieldLabel: "text-sm font-medium text-gray-700",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-sm text-gray-500",
                    footerActionText: "text-sm text-gray-600",
                    footerActionLink:
                      "text-sm font-medium text-indigo-600 hover:text-indigo-500",
                  },
                }}
              />
              </ClientOnly>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Authentication not configured</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sign-up will be available once Clerk authentication keys are configured.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
