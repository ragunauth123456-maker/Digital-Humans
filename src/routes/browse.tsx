import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getPublishedProfiles } from "~/lib/profile";
import type { Profile } from "~/lib/profile";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";

export const Route = createFileRoute("/browse")({
  component: BrowsePage,
});

const GRADIENTS = [
  "from-indigo-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getGradient(id: number): string {
  return GRADIENTS[id % GRADIENTS.length];
}

function bioPreview(biography: string | undefined, maxLen = 120): string {
  if (!biography) return "";
  return biography.length > maxLen
    ? biography.slice(0, maxLen).trimEnd() + "…"
    : biography;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-100" />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-20 rounded-full bg-gray-100" />
        <div className="h-6 w-16 rounded-full bg-gray-100" />
        <div className="h-6 w-24 rounded-full bg-gray-100" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="h-3 w-4/6 rounded bg-gray-100" />
      </div>
    </div>
  );
}

function BrowsePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setDbError(false);
      try {
        const result = await getPublishedProfiles();
        if (result.success) {
          setProfiles(result.profiles);
        } else {
          setDbError(true);
        }
      } catch {
        setDbError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Collect all unique expertise tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    profiles.forEach((p) => {
      (p.expertise_areas ?? []).forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [profiles]);

  // Filter profiles by search query and selected tag
  const filtered = useMemo(() => {
    let result = profiles;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.display_name.toLowerCase().includes(q) ||
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.expertise_areas ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag) {
      result = result.filter((p) =>
        (p.expertise_areas ?? []).includes(selectedTag)
      );
    }

    return result;
  }, [profiles, searchQuery, selectedTag]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Browse Digital Humans
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              Discover professionals who have created Digital Humans — AI
              representations of their expertise, available on demand.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Error state: DB unavailable */}
          {dbError && (
            <div className="text-center py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <svg
                  className="h-8 w-8 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Coming Soon
              </h2>
              <p className="mt-2 text-gray-600">
                The Digital Humans marketplace is being set up. Check back
                shortly!
              </p>
            </div>
          )}

          {/* Loading state */}
          {!dbError && loading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Loaded state */}
          {!dbError && !loading && (
            <>
              {/* Empty state: no profiles yet */}
              {profiles.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                    <svg
                      className="h-8 w-8 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-gray-900">
                    No Digital Humans yet
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Be the first to create your Digital Human and join the
                    marketplace.
                  </p>
                  <Link
                    to="/profile/create"
                    className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                  >
                    Create Your Digital Human
                  </Link>
                </div>
              ) : (
                <>
                  {/* Search & filter bar */}
                  <div className="mb-8 space-y-4">
                    {/* Search input */}
                    <div className="relative max-w-md">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by name, title, or expertise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-xl border-gray-200 pl-10 pr-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    {/* Expertise filter tags */}
                    {allTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedTag(null)}
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedTag === null
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          All
                        </button>
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() =>
                              setSelectedTag(
                                selectedTag === tag ? null : tag
                              )
                            }
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                              selectedTag === tag
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Result count */}
                    <p className="text-sm text-gray-500">
                      Showing {filtered.length} of {profiles.length} Digital
                      Human{profiles.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Filtered empty state */}
                  {filtered.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-gray-500">
                        No Digital Humans match your search. Try adjusting your
                        filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedTag(null);
                        }}
                        className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    /* Profile cards grid */
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {filtered.map((profile) => {
                        const initials = getInitials(profile.display_name);
                        const gradient = getGradient(profile.id);
                        const preview = bioPreview(profile.biography);
                        return (
                          <Link
                            key={profile.id}
                            to="/profile/$profileId"
                            params={{ profileId: String(profile.id) }}
                            className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-indigo-200 transition-all"
                          >
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-xl font-bold text-white shadow-sm`}
                              >
                                {initials}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                  {profile.display_name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {profile.title || "Professional"}
                                  {profile.years_experience
                                    ? ` · ${profile.years_experience} year${profile.years_experience !== 1 ? "s" : ""}`
                                    : ""}
                                </p>
                              </div>
                            </div>

                            {/* Expertise tags */}
                            {(profile.expertise_areas ?? []).length > 0 && (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {profile.expertise_areas!.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Bio preview */}
                            {preview && (
                              <p className="mt-5 flex-1 text-sm leading-relaxed text-gray-600">
                                {preview}
                              </p>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
