import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, User, ListChecks, ChevronRight, Activity } from "lucide-react";
import { Orb } from "@/components/orb";
import { SideDrawer, type OrbColor, type OrbStyleKey } from "@/components/side-drawer";
import { TasksView } from "@/components/tasks-view";
import { JarvisPortal } from "@/components/jarvis-portal";
import {
  JarvisConsole,
  type JarvisItem,
  type JarvisStatus,
  type StressAnalysis,
} from "@/components/jarvis-console";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JARVIS Orbe — Votre journée, projets et détox" },
      {
        name: "description",
        content:
          "Application mobile futuriste : orbe interactif personnalisable, assistant vocal JARVIS qui crée vos tâches, et programme de dopamine detox.",
      },
      { property: "og:title", content: "JARVIS Orbe — Votre journée" },
      {
        property: "og:description",
        content:
          "Parlez à JARVIS : il crée vos tâches, analyse votre stress et vous aide à réduire vos mauvaises habitudes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [color, setColor] = useState<OrbColor>("red");
  const [orbStyle, setOrbStyle] = useState<OrbStyleKey>("planetary");
  const [view, setView] = useState<"home" | "tasks" | "detox">("home");
  const [status, setStatus] = useState<JarvisStatus>("idle");
  const [tasks, setTasks] = useState<JarvisItem[]>([]);
  const [detox, setDetox] = useState<JarvisItem[]>([]);
  const [stress, setStress] = useState<StressAnalysis | null>(null);

  const addUnique = (prev: JarvisItem[], next: JarvisItem[]) => {
    const titles = new Set(prev.map((i) => i.title));
    return [...prev, ...next.filter((i) => i.title && !titles.has(i.title))];
  };

  if (view !== "home") {
    return (
      <main className="mx-auto min-h-screen w-full max-w-md bg-background">
        <TasksView
          mode={view}
          onBack={() => setView("home")}
          items={view === "tasks" ? tasks : detox}
          stress={stress}
        />
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

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="relative">
            <Orb color={color} style={orbStyle} active={status !== "idle"} />
            <button
              onClick={() => setIsPortalOpen(true)}
              aria-label="Ouvrir JARVIS 3D"
              className="absolute inset-0 bg-transparent border-0 cursor-pointer w-full h-full z-20 focus:outline-none"
            />
          </div>
        </div>

        {stress && (
          <button
            onClick={() => setView("detox")}
            className="mb-3 flex w-full items-center gap-3 rounded-3xl border border-border bg-card px-5 py-4 text-left"
          >
            <Activity className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span className="min-w-0">
              <span className="block text-xs tracking-[0.14em] text-foreground">
                STRESS : {stress.level}%
              </span>
              <span className="block truncate text-xs text-muted-foreground">{stress.summary}</span>
            </span>
          </button>
        )}

        <button
          onClick={() => setView("tasks")}
          className="flex w-full items-center gap-4 rounded-3xl border border-border bg-card px-5 py-5 text-left transition-colors hover:bg-secondary/60"
        >
          <ListChecks className="h-5 w-5 shrink-0 text-muted-foreground" />
          <span className="text-xs leading-snug tracking-[0.14em] text-foreground">
            ACCÉDER À MES PROJETS ET TÂCHES
            <span className="mt-1 block text-[10px] tracking-normal text-muted-foreground">
              {tasks.length} tâche{tasks.length > 1 ? "s" : ""} créée
              {tasks.length > 1 ? "s" : ""} par JARVIS
            </span>
          </span>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        <JarvisConsole
          status={status}
          onStatusChange={setStatus}
          onConfirmTasks={(items) => setTasks((prev) => addUnique(prev, items))}
          onConfirmDetox={(items) => setDetox((prev) => addUnique(prev, items))}
          onStress={setStress}
        />
      </div>

      <JarvisPortal color={color} open={isPortalOpen} onClose={() => setIsPortalOpen(false)} />
    </main>
  );
}
