import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/lib/auth";
import { createProfile } from "~/lib/profile";

export const Route = createFileRoute("/profile/create")({
  component: ProfileCreatePage,
});

type Credential = { name: string; issuer: string; year: number };
type Education = { degree: string; institution: string; year: number };
type Certification = { name: string; issuer: string; year: number };

type Status = "idle" | "submitting" | "success" | "error" | "no-db";

const STEPS = ["Identity", "Expertise", "Credentials", "Review"] as const;

function ProfileCreatePage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const navigate = useNavigate();

  // Step state
  const [step, setStep] = useState(0);

  // Section 1: Identity
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [biography, setBiography] = useState("");

  // Section 2: Expertise
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");

  // Section 3: Credentials
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");

  // Form status
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Tag helpers
  function addTag(value: string, setter: (cb: (prev: string[]) => string[]) => void) {
    const trimmed = value.trim();
    if (trimmed && trimmed.length > 0) {
      setter((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    }
  }
  function removeTag(tag: string, setter: (cb: (prev: string[]) => string[]) => void) {
    setter((prev) => prev.filter((t) => t !== tag));
  }

  // Credential helpers
  function addCredential() {
    setCredentials((prev) => [...prev, { name: "", issuer: "", year: new Date().getFullYear() }]);
  }
  function updateCredential(idx: number, field: keyof Credential, value: string | number) {
    setCredentials((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  }
  function removeCredential(idx: number) {
    setCredentials((prev) => prev.filter((_, i) => i !== idx));
  }

  // Education helpers
  function addEducation() {
    setEducation((prev) => [...prev, { degree: "", institution: "", year: new Date().getFullYear() }]);
  }
  function updateEducation(idx: number, field: keyof Education, value: string | number) {
    setEducation((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  }
  function removeEducation(idx: number) {
    setEducation((prev) => prev.filter((_, i) => i !== idx));
  }

  // Certification helpers
  function addCertification() {
    setCertifications((prev) => [...prev, { name: "", issuer: "", year: new Date().getFullYear() }]);
  }
  function updateCertification(idx: number, field: keyof Certification, value: string | number) {
    setCertifications((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  }
  function removeCertification(idx: number) {
    setCertifications((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    setStatus("submitting");
    setMessage("");

    try {
      const result = await createProfile({
        clerkUserId: user.id,
        display_name: displayName.trim(),
        title: title.trim() || undefined,
        biography: biography.trim() || undefined,
        expertise_areas: expertiseAreas,
        years_experience: yearsExperience ? parseInt(yearsExperience, 10) : undefined,
        credentials: credentials.filter((c) => c.name.trim()),
        education: education.filter((e) => e.degree.trim()),
        certifications: certifications.filter((c) => c.name.trim()),
        languages,
      });

      if (result.success) {
        setStatus("success");
        navigate({ to: "/profile/$profileId", params: { profileId: String(result.profileId) } });
      } else if (result.error === "duplicate") {
        setStatus("error");
        setMessage("You already have a Digital Human profile.");
      } else if (result.error === "no-db") {
        setStatus("no-db");
        setMessage("Our database isn't ready yet, but we've captured your profile. It'll be saved when we're connected.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("required")) {
        setStatus("error");
        setMessage(msg);
      } else {
        setStatus("error");
        setMessage("Unable to reach the server. Please try again.");
      }
    }
  }

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
              Sign in to create your Digital Human
            </h2>
            <p className="mt-2 text-gray-600">
              You need an account to create your Digital Human profile. It only takes a moment.
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
            Digital Humans
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
          >
            My Dashboard
          </Link>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      idx <= step
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {idx < step ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`hidden sm:inline text-sm font-medium ${
                      idx <= step ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`mx-2 sm:mx-4 h-0.5 w-8 sm:w-16 transition-colors ${
                      idx < step ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <form onSubmit={handleSubmit}>
          {/* Status messages */}
          {status === "error" && message && (
            <div className="mb-8 rounded-xl bg-red-50 p-4 text-center ring-1 ring-red-200">
              <p className="text-sm text-red-800">{message}</p>
            </div>
          )}
          {status === "no-db" && message && (
            <div className="mb-8 rounded-xl bg-amber-50 p-4 text-center ring-1 ring-amber-200">
              <p className="text-sm text-amber-800">{message}</p>
            </div>
          )}

          {/* Step 1: Identity */}
          {step === 0 && (
            <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Professional Identity</h2>
              <p className="mt-1 text-sm text-gray-500">Tell us who you are professionally.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Dr. Sarah Chen"
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Professional Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Structural Engineer"
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>

                <div>
                  <label htmlFor="biography" className="block text-sm font-medium text-gray-700">
                    Professional Biography
                  </label>
                  <textarea
                    id="biography"
                    rows={5}
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    placeholder="Share your professional story — what drives you, what you've accomplished, and the expertise you bring..."
                    className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-y"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 2: Expertise */}
          {step === 1 && (
            <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Areas of Expertise</h2>
              <p className="mt-1 text-sm text-gray-500">What are you known for? Add your key skills and specializations.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise Areas
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {expertiseAreas.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag, setExpertiseAreas)}
                          className="ml-0.5 text-indigo-400 hover:text-indigo-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(expertiseInput, setExpertiseAreas);
                          setExpertiseInput("");
                        }
                      }}
                      placeholder="Bridge Design"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addTag(expertiseInput, setExpertiseAreas);
                        setExpertiseInput("");
                      }}
                      className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">
                    Years of Professional Experience
                  </label>
                  <input
                    id="yearsExperience"
                    type="number"
                    min={0}
                    max={70}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="35"
                    className="mt-1.5 block w-full max-w-xs rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 3: Credentials & Education */}
          {step === 2 && (
            <div className="space-y-8">
              {/* Credentials */}
              <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Credentials</h2>
                    <p className="mt-1 text-sm text-gray-500">Licenses, certifications, and professional designations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCredential}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    + Add
                  </button>
                </div>

                {credentials.length === 0 ? (
                  <p className="mt-6 text-sm text-gray-400 italic">No credentials added yet.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {credentials.map((cred, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-gray-50">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={cred.name}
                            onChange={(e) => updateCredential(idx, "name", e.target.value)}
                            placeholder="P.E. License"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                          <input
                            type="text"
                            value={cred.issuer}
                            onChange={(e) => updateCredential(idx, "issuer", e.target.value)}
                            placeholder="Issuing organization"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                          <input
                            type="number"
                            value={cred.year}
                            onChange={(e) => updateCredential(idx, "year", parseInt(e.target.value, 10) || new Date().getFullYear())}
                            placeholder="Year"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCredential(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Education */}
              <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Education</h2>
                    <p className="mt-1 text-sm text-gray-500">Degrees and academic background.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    + Add
                  </button>
                </div>

                {education.length === 0 ? (
                  <p className="mt-6 text-sm text-gray-400 italic">No education added yet.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {education.map((edu, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-gray-50">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                            placeholder="Ph.D. Civil Engineering"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                            placeholder="MIT"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                          <input
                            type="number"
                            value={edu.year}
                            onChange={(e) => updateEducation(idx, "year", parseInt(e.target.value, 10) || new Date().getFullYear())}
                            placeholder="Year"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Certifications */}
              <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
                    <p className="mt-1 text-sm text-gray-500">Professional certifications and specialized training.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    + Add
                  </button>
                </div>

                {certifications.length === 0 ? (
                  <p className="mt-6 text-sm text-gray-400 italic">No certifications added yet.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {certifications.map((cert, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-gray-50">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertification(idx, "name", e.target.value)}
                            placeholder="AWS Solutions Architect"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(idx, "issuer", e.target.value)}
                            placeholder="Amazon Web Services"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                          <input
                            type="number"
                            value={cert.year}
                            onChange={(e) => updateCertification(idx, "year", parseInt(e.target.value, 10) || new Date().getFullYear())}
                            placeholder="Year"
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertification(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Languages */}
              <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Languages</h2>
                <p className="mt-1 text-sm text-gray-500">Languages you speak professionally.</p>

                <div className="mt-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeTag(lang, setLanguages)}
                          className="ml-0.5 text-indigo-400 hover:text-indigo-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(languageInput, setLanguages);
                          setLanguageInput("");
                        }
                      }}
                      placeholder="English"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addTag(languageInput, setLanguages);
                        setLanguageInput("");
                      }}
                      className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <section className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Review Your Profile</h2>
              <p className="mt-1 text-sm text-gray-500">Here's a summary of everything you've entered. Ready to create your Digital Human?</p>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-lg font-bold text-white shadow-sm">
                    {displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{displayName || "(No name)"}</h3>
                    {title && <p className="text-sm text-gray-500">{title}</p>}
                  </div>
                </div>

                {biography && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Biography</h4>
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed">{biography}</p>
                  </div>
                )}

                {expertiseAreas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Expertise</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {expertiseAreas.map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {yearsExperience && (
                      <p className="mt-2 text-sm text-gray-600">{yearsExperience} years of experience</p>
                    )}
                  </div>
                )}

                {credentials.filter((c) => c.name.trim()).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Credentials</h4>
                    <ul className="mt-1 space-y-1">
                      {credentials.filter((c) => c.name.trim()).map((c, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          {c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {education.filter((e) => e.degree.trim()).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Education</h4>
                    <ul className="mt-1 space-y-1">
                      {education.filter((e) => e.degree.trim()).map((e, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          {e.degree}{e.institution ? ` — ${e.institution}` : ""}{e.year ? ` (${e.year})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {certifications.filter((c) => c.name.trim()).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Certifications</h4>
                    <ul className="mt-1 space-y-1">
                      {certifications.filter((c) => c.name.trim()).map((c, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          {c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? ` (${c.year})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {languages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Languages</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <span key={lang} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(3, s + 1))}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Creating…" : "Create My Digital Human"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
