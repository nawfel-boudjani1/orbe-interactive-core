import { ArrowLeft, Check, Flame } from "lucide-react";
import { useState } from "react";

interface TasksViewProps {
  mode: "tasks" | "detox";
  onBack: () => void;
}

const taskSeed = [
  { title: "Boire un verre d'eau", meta: "Habitude · 1 min" },
  { title: "Faire une marche de 5 min.", meta: "Habitude · 5 min" },
  { title: "Codage en C — module 3", meta: "Projet · 2 h" },
  { title: "Traiter les emails", meta: "Projet · 30 min" },
  { title: "Méditation post-stress", meta: "Substitution · 10 min" },
];

const detoxSeed = [
  { title: "Aucun réseau social avant midi", meta: "Streak · 6 jours" },
  { title: "Téléphone hors de la chambre", meta: "Streak · 12 jours" },
  { title: "Une seule session de vidéo courte", meta: "Streak · 3 jours" },
  { title: "Marche au lieu du scroll", meta: "Substitution suggérée" },
];

export function TasksView({ mode, onBack }: TasksViewProps) {
  const items = mode === "tasks" ? taskSeed : detoxSeed;
  const [done, setDone] = useState<string[]>([]);

  const toggle = (title: string) =>
    setDone((d) => (d.includes(title) ? d.filter((t) => t !== title) : [...d, title]));

  return (
    <div className="flex min-h-screen flex-col px-5 pb-10 pt-6">
      <header className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Retour"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm tracking-[0.25em] text-foreground">
          {mode === "tasks" ? "PROJETS ET TÂCHES" : "DOPAMINE DETOX"}
        </h1>
      </header>

      {mode === "detox" && (
        <div className="mt-6 flex items-center gap-3 rounded-3xl border border-border bg-card px-4 py-4">
          <Flame className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-foreground">Streak actuel : 12 jours</p>
            <p className="text-xs text-muted-foreground">Record personnel : 45 jours</p>
          </div>
        </div>
      )}

      <ul className="mt-6 space-y-2">
        {items.map((item) => {
          const isDone = done.includes(item.title);
          return (
            <li key={item.title}>
              <button
                onClick={() => toggle(item.title)}
                className="flex w-full items-center gap-4 rounded-3xl border border-border bg-card px-4 py-4 text-left transition-colors hover:bg-secondary/60"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isDone ? "border-ring bg-secondary" : "border-border"
                  }`}
                >
                  {isDone && <Check className="h-4 w-4 text-foreground" />}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-sm ${
                      isDone ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">{item.meta}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-auto pt-8 text-center text-[10px] tracking-[0.3em] text-muted-foreground">
        {done.length} / {items.length} COMPLÉTÉS
      </p>
    </div>
  );
}
