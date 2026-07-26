export default function FoundingMemberSection() {
  return (
    <section id="founding-member" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
              Limited Time
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Become a Founding Member
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Secure your place in the first wave of Digital Humans. Founding
            Members get priority early access, a verified badge on their
            profile, and lifetime discounted licensing fees.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-amber-200">
            {/* Price */}
            <div className="text-center">
              <p className="text-5xl font-bold tracking-tight text-gray-900">
                $29
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">
                one-time payment
              </p>
            </div>

            {/* Benefits */}
            <ul className="mt-8 space-y-3">
              {[
                "Priority early access to create your Digital Human",
                "Verified Founding Member badge on your profile",
                "Lifetime 20% discount on marketplace licensing fees",
                "Your name listed on the Founding Members wall (optional)",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href="https://buy.stripe.com/4gM4gy4fOdFe6dX0DT1kA0j"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-center text-base font-semibold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-lg"
              >
                Become a Founding Member — $29
              </a>
            </div>

            {/* Secondary link */}
            <p className="mt-4 text-center text-sm text-gray-500">
              <a
                href="#waitlist"
                className="font-medium text-gray-600 underline underline-offset-4 hover:text-indigo-600 transition-colors"
              >
                Or join the free waitlist
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
