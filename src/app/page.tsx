import Link from "next/link";

const tools = [
  {
    href: "/tools/logo-presentation",
    title: "Presentaciones de logo",
    description: "Armá y compartí presentaciones de logos con clientes.",
    emoji: "🎨",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold text-zinc-900">Herramientas · Bardo</h1>
        <p className="mt-2 text-zinc-500">Seleccioná una herramienta para continuar.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="font-medium text-zinc-900">{tool.title}</span>
              <span className="text-sm text-zinc-500">{tool.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
