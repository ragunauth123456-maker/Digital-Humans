interface Profile {
  initials: string;
  name: string;
  title: string;
  years: string;
  expertise: string[];
  quote: string;
  gradient: string;
}

const profiles: Profile[] = [
  {
    initials: "SC",
    name: "Dr. Sarah Chen",
    title: "Structural Engineer",
    years: "35 years",
    expertise: ["Bridge Design", "Failure Analysis", "Seismic Engineering"],
    quote:
      "I've spent my career understanding why structures fail and how to make them last. My Digital Human means that knowledge doesn't retire when I do — it stays in the field, helping engineers make better decisions every day.",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    initials: "JO",
    name: "Prof. James Okafor",
    title: "Mining Engineer",
    years: "40 years",
    expertise: [
      "Operational Optimization",
      "Safety Systems",
      "Mineral Processing",
    ],
    quote:
      "After four decades teaching and consulting across Africa, I've seen the same mistakes repeated. A Digital Human means my students and clients can access my experience long after I leave the classroom — saving lives and resources.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    initials: "MS",
    name: "Maria Santos",
    title: "Business Strategist",
    years: "28 years",
    expertise: [
      "Market Entry",
      "Organizational Transformation",
      "M&A Integration",
    ],
    quote:
      "I've guided dozens of companies through transformations that can't be captured in a playbook. My Digital Human brings my strategic instinct to organizations that need it, when they need it — at a fraction of consulting rates.",
    gradient: "from-violet-500 to-purple-600",
  },
];

export default function ExampleProfiles() {
  return (
    <section id="examples" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet the First Digital Humans
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Real professionals. Real expertise. Available on demand. These are
            the kinds of Digital Humans coming to the marketplace.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.initials}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${profile.gradient} text-xl font-bold text-white shadow-sm`}
                >
                  {profile.initials}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {profile.title} &middot; {profile.years}
                  </p>
                </div>
              </div>

              {/* Expertise tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-gray-600 italic">
                &ldquo;{profile.quote}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
