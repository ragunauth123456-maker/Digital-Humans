export default function ProblemSection() {
  return (
    <section id="problem" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Extraordinary Knowledge Is Disappearing Every Day
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            When a professional retires, resigns, or becomes unavailable, decades
            of hard-won insight, intuition, and judgment vanish overnight. The
            world loses what took a lifetime to build — and there&apos;s no way to
            get it back.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              A Retired Engineer&apos;s 40 Years
            </h3>
            <p className="mt-3 text-gray-600">
              After four decades designing bridges across three continents, a
              structural engineer retires. Thousands of design decisions, failure
              analyses, and seismic assessments — gone. Junior engineers now
              face the same problems with none of the accumulated wisdom.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              A Professor&apos;s Teaching Ends
            </h3>
            <p className="mt-3 text-gray-600">
              A mining engineering professor retires after a 40-year academic
              career. Their unique approach to teaching mineral processing,
              safety systems, and operational optimization — shaped by mentoring
              thousands of students — ends with their last lecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
