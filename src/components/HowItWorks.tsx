const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Establish your professional identity with credentials, areas of expertise, and career highlights. This becomes the foundation of your Digital Human.",
  },
  {
    number: "02",
    title: "Upload Your Knowledge",
    description:
      "Share your documents, research, case studies, project files, and written insights. Everything that shaped your expertise becomes part of your Digital Human's knowledge base.",
  },
  {
    number: "03",
    title: "Train & Validate",
    description:
      "Your Digital Human learns your reasoning patterns and decision-making style. You review, correct, and approve its responses until it meets your standards.",
  },
  {
    number: "04",
    title: "Go Live on the Marketplace",
    description:
      "Set your licensing terms and pricing. Your Digital Human becomes available to organizations and individuals worldwide — working, earning, and creating impact 24/7.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Four steps from your expertise to a working Digital Human on the
            marketplace.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
            >
              <span className="text-3xl font-bold text-indigo-200">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
