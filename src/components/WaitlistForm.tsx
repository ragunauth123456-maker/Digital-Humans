import { useState, type FormEvent } from "react";
import { createServerFn } from "@tanstack/react-start";

const submitWaitlist = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const obj = data as { email?: string; name?: string | null; interested_as?: string };
    const email = obj.email?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please provide a valid email address.");
    }
    const name = obj.name?.trim() || null;
    const interestedAs = ["professional", "organization", "both"].includes(
      obj.interested_as ?? "",
    )
      ? obj.interested_as!
      : "both";
    return { email, name, interested_as: interestedAs };
  })
  .handler(async ({ data }) => {
    let neonPkg: typeof import("@neondatabase/serverless") | null = null;
    try {
      neonPkg = await import("@neondatabase/serverless");
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    const url = process.env.DATABASE_URL;
    if (!url) {
      return { success: false as const, error: "no-db" as const };
    }

    const sql = neonPkg.neon(url);

    // Ensure table exists
    try {
      await sql`CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        interested_as TEXT CHECK (interested_as IN ('professional', 'organization', 'both')) DEFAULT 'both',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`;
    } catch {
      return { success: false as const, error: "no-db" as const };
    }

    try {
      await sql`
        INSERT INTO waitlist (email, name, interested_as)
        VALUES (${data.email}, ${data.name}, ${data.interested_as})
      `;
      return { success: true as const };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("unique") || msg.includes("duplicate")) {
        return { success: false as const, error: "duplicate" as const };
      }
      return { success: false as const, error: "unknown" as const };
    }
  });

type Status = "idle" | "submitting" | "success" | "error" | "no-db";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interestedAs, setInterestedAs] = useState("both");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const result = await submitWaitlist({ email: email.trim(), name: name.trim() || null, interested_as: interestedAs });

      if (result.success) {
        setStatus("success");
        setMessage("You're on the list — we'll be in touch soon.");
        setEmail("");
        setName("");
        setInterestedAs("both");
      } else if (result.error === "duplicate") {
        setStatus("error");
        setMessage("You're already on the waitlist! We'll be in touch soon.");
      } else if (result.error === "no-db") {
        setStatus("no-db");
        setMessage(
          "The waitlist isn't connected yet, but we've captured your interest. Check back soon — we're setting things up."
        );
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("valid email")) {
        setStatus("error");
        setMessage("Please provide a valid email address.");
      } else {
        setStatus("error");
        setMessage("Unable to reach the server. Please try again.");
      }
    }
  }

  return (
    <section id="waitlist" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get Early Access
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Be among the first to create your Digital Human — or access expertise
            from the world&apos;s best professionals.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md">
          {status === "success" ? (
            <div className="rounded-2xl bg-green-50 p-6 text-center ring-1 ring-green-200">
              <svg
                className="mx-auto h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-3 text-sm font-medium text-green-800">
                {message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="interested-as"
                  className="block text-sm font-medium text-gray-700"
                >
                  I&apos;m interested as a…
                </label>
                <select
                  id="interested-as"
                  value={interestedAs}
                  onChange={(e) => setInterestedAs(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                >
                  <option value="both">Both — Professional &amp; Organization</option>
                  <option value="professional">Professional — I want to create a Digital Human</option>
                  <option value="organization">Organization — I want to access expertise</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Submitting…" : "Get Early Access"}
              </button>

              {status === "no-db" && (
                <div className="rounded-xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
                  <p className="text-sm text-amber-800">{message}</p>
                </div>
              )}

              {status === "error" && (
                <div className="rounded-xl bg-red-50 p-4 text-center ring-1 ring-red-200">
                  <p className="text-sm text-red-800">{message}</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
