import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Sprout,
  UsersRound,
} from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Inspire action",
    description:
      "We turn everyday environmental ideas into practical steps people can take.",
  },
  {
    icon: UsersRound,
    title: "Grow together",
    description:
      "A welcoming place for curious minds, local voices, and eco-conscious communities.",
  },
  {
    icon: HeartHandshake,
    title: "Create impact",
    description:
      "We celebrate progress, share knowledge, and make sustainable choices feel possible.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-slate-950 px-6 py-12 text-white shadow-xl shadow-emerald-950/15 sm:px-10 sm:py-16 dark:border-emerald-900/70">
        <div className="absolute -right-24 -top-28 size-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 size-72 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            <Sprout className="size-3.5" />
            About Eco Spark Hub
          </div>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            Small sparks can grow into lasting change.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Eco Spark Hub is a community space for learning, sharing, and
            acting on the ideas that help our planet thrive. We believe a
            greener future begins when more people feel informed and included.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Connect with us
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <article
              key={value.title}
              className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                {value.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {value.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Our purpose
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            A brighter path for people and planet.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
            From discovering sustainable habits to exchanging practical ideas,
            Eco Spark Hub helps make environmental progress part of everyday
            life. Every conversation, post, and action can help move the
            community forward.
          </p>

          <ul className="mt-7 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            {[
              "Learn from ideas that make sustainability feel approachable.",
              "Share your own perspective and encourage others to join in.",
              "Build momentum for a cleaner, kinder future together.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-64 overflow-hidden bg-emerald-700 p-6 sm:p-10">
          <div className="absolute -right-20 -top-20 size-64 rounded-full border-[28px] border-emerald-500/40" />
          <div className="absolute -bottom-24 -left-20 size-64 rounded-full border-[28px] border-lime-300/20" />
          <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-slate-950/15 p-6 backdrop-blur-sm">
            <Leaf className="size-9 text-lime-200" />
            <div>
              <p className="text-lg font-semibold leading-7 text-white">
                “The future is shaped by the choices we make today.”
              </p>
              <p className="mt-3 text-sm text-emerald-100">
                Join the movement, one meaningful step at a time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
