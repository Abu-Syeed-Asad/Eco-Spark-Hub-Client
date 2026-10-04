type Section = {
  title: string;
  text: string | string[];
};

type LegalPageProps = {
  badge: string;
  title: string;
  intro: string;
  sections: Section[];
};

export default function LegalPage({
  badge,
  title,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-slate-950 px-6 py-10 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-14 dark:border-emerald-900/70">
        <div className="absolute hidden" aria-hidden="true" />
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
            {badge}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {intro}
          </p>
        </div>
      </section>

      <div className="space-y-5">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {Array.isArray(section.text)
                ? section.text.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
                : <p>{section.text}</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
