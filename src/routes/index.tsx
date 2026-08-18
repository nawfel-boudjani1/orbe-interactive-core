import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, User, ListChecks, Mic, ChevronRight } from "lucide-react";
import { Orb } from "@/components/orb";
import { SideDrawer, type OrbColor, type OrbStyleKey } from "@/components/side-drawer";
import { TasksView } from "@/components/tasks-view";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JARVIS Orbe — Votre journée, projets et détox" },
      {
        name: "description",
        content:
          "Application mobile futuriste : orbe interactif personnalisable, suivi de projets et tâches, et programme de dopamine detox.",
      },
      { property: "og:title", content: "JARVIS Orbe — Votre journée" },
      {
        property: "og:description",
        content:
          "Orbe interactif personnalisable, projets et tâches, et réduction des mauvaises habitudes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [color, setColor] = useState<OrbColor>("red");
  const [orbStyle, setOrbStyle] = useState<OrbStyleKey>("planetary");
  const [view, setView] = useState<"home" | "tasks" | "detox">("home");
  const [listening, setListening] = useState(false);

  if (view !== "home") {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md bg-background">
        <TasksView mode={view} onBack={() => setView("home")} />
      </main>
    );
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-background">
      <SideDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        color={color}
        onColorChange={setColor}
        orbStyle={orbStyle}
        onStyleChange={setOrbStyle}
        onNavigate={(v) => {
          setView(v);
          setMenuOpen(false);
        }}
      />

      <div className="flex min-h-screen flex-col px-5 pb-8 pt-6">
        <header className="flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm tracking-[0.3em] text-foreground">VOTRE JOURNÉE</h1>
          <button
            aria-label="Profil"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <User className="h-5 w-5" />
          </button>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <Orb color={color} style={orbStyle} />
        </div>

        <button
          onClick={() => setView("tasks")}
          className="flex w-full items-center gap-4 rounded-3xl border border-border bg-card px-5 py-5 text-left transition-colors hover:bg-secondary/60"
        >
          <ListChecks className="h-5 w-5 shrink-0 text-muted-foreground" />
          <span className="text-xs leading-snug tracking-[0.14em] text-foreground">
            ACCÉDER À MES PROJETS ET TÂCHES
          </span>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            onClick={() => setListening((l) => !l)}
            aria-label="Activer le micro"
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors ${
              listening ? "bg-secondary text-foreground animate-pulse" : "text-muted-foreground"
            }`}
          >
            <Mic className="h-4 w-4" />
          </button>
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground">
            {listening ? "JARVIS ÉCOUTE…" : "JARVIS VOUS ÉCOUTE"}
          </span>
        </div>
      </div>
    </main>
  );
}
