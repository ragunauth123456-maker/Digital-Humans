import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getProfile } from "~/lib/profile";
import type { Profile } from "~/lib/profile";
import ChatWidget from "~/components/ChatWidget";

export const Route = createFileRoute("/profile/$profileId")({
  component: ProfileViewPage,
});

function ProfileViewPage() {
  const { profileId } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await getProfile({ profileId: parseInt(profileId, 10) });
        if (result.success) {
          setProfile(result.profile);
        } else if (result.error === "not-found") {
          setError("not-found");
        } else {
          setError("unavailable");
        }
      } catch {
        setError("unavailable");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profileId]);

  // Initials for avatar gradient
  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const gradients = [
    "from-indigo-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  const gradient = gradients[profile?.id ? profile.id % gradients.length : 0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
            Digital Humans
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
          >
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : error === "not-found" ? (
          <div className="text-center py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Digital Human Not Found
            </h2>
            <p className="mt-2 text-gray-600">
              This profile doesn&apos;t exist yet. It may have been removed or the link may be incorrect.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
            >
              Browse Digital Humans
            </Link>
          </div>
        ) : error === "unavailable" ? (
          <div className="text-center py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              Profiles Unavailable
            </h2>
            <p className="mt-2 text-gray-600">
              The profile database isn&apos;t connected yet. Check back soon — we&apos;re setting things up.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
            >
              Back to Home
            </Link>
          </div>
        ) : profile ? (
          <>
            {!profile.is_published && (
              <div className="mb-8 rounded-xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                <p className="text-sm font-medium text-amber-800">
                  This Digital Human is not yet available for hire.
                </p>
              </div>
            )}

            {/* Profile header */}
            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div
                  className={`flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl font-bold text-white shadow-md`}
                >
                  {initials}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {profile.display_name}
                  </h1>
                  {profile.title && (
                    <p className="mt-1 text-lg text-gray-600">{profile.title}</p>
                  )}
                  {profile.years_experience && (
                    <p className="mt-1 text-sm text-gray-500">
                      {profile.years_experience} years of professional experience
                    </p>
                  )}
                </div>
                <div>
                  <a
                    href="#waitlist"
                    className="inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
                  >
                    Hire This Digital Human
                  </a>
                </div>
              </div>
            </div>

            {/* Biography */}
            {profile.biography && (
              <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="mt-3 text-gray-700 leading-relaxed">{profile.biography}</p>
              </div>
            )}

            {/* Expertise */}
            {profile.expertise_areas.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Areas of Expertise</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.expertise_areas.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Credentials */}
            {profile.credentials.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Credentials</h3>
                <ul className="mt-4 space-y-3">
                  {profile.credentials.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-sm text-gray-500">
                          {c.issuer}{c.year ? ` — ${c.year}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education */}
            {profile.education.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <ul className="mt-4 space-y-3">
                  {profile.education.map((e, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{e.degree}</p>
                        <p className="text-sm text-gray-500">
                          {e.institution}{e.year ? ` — ${e.year}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {profile.certifications.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                <ul className="mt-4 space-y-3">
                  {profile.certifications.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-sm text-gray-500">
                          {c.issuer}{c.year ? ` — ${c.year}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages */}
            {profile.languages.length > 0 && (
              <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <ChatWidget profile={{ id: profile.id, display_name: profile.display_name, is_published: profile.is_published }} />
          </>
        ) : null}
      </div>
    </div>
  );
}
