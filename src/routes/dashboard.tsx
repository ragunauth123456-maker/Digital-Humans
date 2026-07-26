import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import { getMyProfile } from "~/lib/profile";
import type { Profile } from "~/lib/profile";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      try {
        const result = await getMyProfile({ clerkUserId: user!.id });
        if (result.success) {
          setProfile(result.profile);
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  // Auth gate
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
              Digital Humans
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your dashboard
            </h2>
            <p className="mt-2 text-gray-600">
              Manage your Digital Human profile, track engagement, and more.
            </p>
            <Link
              to="/sign-in"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.firstName
      ? user.firstName[0] + (user.lastName?.[0] ?? "")
      : "?";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
            Digital Humans
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            My Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Welcome back{user.firstName ? `, ${user.firstName}` : ""}. Manage your Digital Human here.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Profile card */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-xl font-bold text-white shadow-sm">
                  {initials}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">{profile.display_name}</h2>
                  {profile.title && <p className="text-sm text-gray-500">{profile.title}</p>}
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        profile.is_published
                          ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                          : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
                      }`}
                    >
                      {profile.is_published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Created {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link
                  to="/profile/$profileId"
                  params={{ profileId: String(profile.id) }}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Quick stats placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Profile Views", value: "—" },
                { label: "Inquiries", value: "—" },
                { label: "Stage", value: "1 of 6" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200"
                >
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No profile yet */
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-bold text-gray-900">Create Your Digital Human</h2>
            <p className="mt-2 text-gray-600">
              You haven&apos;t created your Digital Human profile yet. It only takes a few minutes.
            </p>
            <Link
              to="/profile/create"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
