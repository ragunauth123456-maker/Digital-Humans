export default function TargetAudiences() {
  return (
    <section id="audiences" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for Professionals and Organizations
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Digital Humans creates value on both sides of the marketplace.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* For Professionals */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              For Professionals
            </h3>
            <p className="mt-3 text-gray-600">
              Your expertise is your most valuable asset. Digital Humans lets
              you monetize it beyond the limits of hourly consulting.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Monetize decades of expertise beyond hourly consulting",
                "Serve thousands of clients simultaneously — while you sleep",
                "Leave a professional legacy that outlasts your career",
                "Set your own licensing terms and pricing",
                "Update and refine your Digital Human as you grow",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* For Organizations */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
              </svg>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-gray-900">
              For Organizations
            </h3>
            <p className="mt-3 text-gray-600">
              Access world-class expertise the moment you need it — without
              retainers, scheduling, or geographic constraints.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Access specialized expertise on demand, not on retainer",
                "Preserve institutional knowledge when senior staff depart",
                "Reduce costly repeat mistakes with expert guidance",
                "Scale mentoring and training across your entire workforce",
                "Source verified expertise vetted by the professionals themselves",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
