import {
  ArrowUpRight,
  Mail,
  MessageCircleHeart,
  Phone,
  Send,
} from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    label: "Call us",
    value: "01797220981",
    href: "tel:+8801797220981",
    description: "Let’s talk about an idea or opportunity.",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "mda457956@gmail.com",
    href: "mailto:mda457956@gmail.com?subject=Eco spark hub &body=Hello%20Asad",
    description: "Send us your questions, thoughts, or feedback.",
  },
];

const socialLinks = [
  {
    initial: "f",
    label: "Facebook",
    href: "https://www.facebook.com/",
    description: "Follow our community",
  },
  {
    initial: "in",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/md-asad-a92653291/",
    description: "Connect professionally",
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/85 px-6 py-10 shadow-sm backdrop-blur sm:px-10 sm:py-14 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="absolute -right-24 -top-28 size-72 rounded-full bg-emerald-200/70 blur-3xl dark:bg-emerald-500/15" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300">
            <MessageCircleHeart className="size-3.5" />
            Contact Eco Spark Hub
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Let&apos;s make a positive impact together.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            Have a question, a fresh idea, or a sustainability story to share?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {contactMethods.map((method) => {
          const Icon = method.icon;

          return (
            <a
              key={method.label}
              href={method.href}
              className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
                  <Icon className="size-5" />
                </div>
                <ArrowUpRight className="size-5 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400" />
              </div>
              <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                {method.label}
              </p>
              <p className="mt-1 break-all text-lg font-semibold text-slate-900 dark:text-white">
                {method.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {method.description}
              </p>
            </a>
          );
        })}
      </section>

      <section className="rounded-3xl bg-emerald-700 p-6 shadow-lg shadow-emerald-950/15 sm:p-10">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <div className="grid size-11 place-items-center rounded-xl bg-white/15 text-lime-200">
              <Send className="size-5" />
            </div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Find us on social media
            </h2>
            <p className="mt-3 leading-7 text-emerald-50/85">
              Stay close to the Eco Spark Hub community. These demo links can
              be replaced with your official pages whenever you&apos;re ready.
            </p>
          </div>

          <div className="grid gap-3 sm:min-w-72">
            {socialLinks.map((social) => {
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-800 transition-colors hover:bg-lime-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-200 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-5 place-items-center rounded-sm bg-emerald-700 text-[11px] font-bold leading-none text-white"
                  >
                    {social.initial}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">
                      {social.label}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {social.description}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
