export default function WhatIsSection() {
  return (
    <section id="what-is" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Is a Digital Human?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            A Digital Human is a persistent AI representation of a
            professional&apos;s identity, knowledge, reasoning patterns, and
            experience. It&apos;s not a generic chatbot — it&apos;s a
            continuously evolving digital professional that thinks and responds
            the way you would.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Not a Chatbot
            </h3>
            <p className="mt-3 text-gray-600">
              Unlike generic AI assistants, a Digital Human carries your
              specific expertise, judgment, and professional standards. It
              reasons the way you&apos;ve taught it to.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Continuously Evolving
            </h3>
            <p className="mt-3 text-gray-600">
              As you grow and learn, your Digital Human grows with you. New
              knowledge, insights, and experiences are integrated — keeping your
              digital counterpart current.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Serves Thousands
            </h3>
            <p className="mt-3 text-gray-600">
              While you sleep, your Digital Human is answering questions,
              solving problems, and mentoring the next generation — serving
              unlimited people simultaneously, anywhere in the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
