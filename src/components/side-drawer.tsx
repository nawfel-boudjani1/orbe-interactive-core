import { ListChecks, Sparkles, X } from "lucide-react";

const colors = [
  { key: "red", label: "Rouge" },
  { key: "blue", label: "Bleu" },
  { key: "green", label: "Vert" },
  { key: "white", label: "Blanc" },
] as const;

export type OrbColor = (typeof colors)[number]["key"];
export type OrbStyleKey = "classic" | "planetary";

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  color: OrbColor;
  onColorChange: (c: OrbColor) => void;
  orbStyle: OrbStyleKey;
  onStyleChange: (s: OrbStyleKey) => void;
  onNavigate: (view: "tasks" | "detox") => void;
}

export function SideDrawer({
  open,
  onClose,
  color,
  onColorChange,
  orbStyle,
  onStyleChange,
  onNavigate,
}: SideDrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[82%] max-w-xs border-r border-border bg-card px-5 py-6 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-[0.25em] text-muted-foreground">RÉGLAGES</span>
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="mt-8">
          <h2 className="text-sm font-medium text-foreground">Personnalisation de l'orbe</h2>
          <p className="mt-1 text-xs text-muted-foreground">Couleur</p>
          <div className="mt-3 flex gap-3">
            {colors.map((c) => (
              <button
                key={c.key}
                onClick={() => onColorChange(c.key)}
                aria-label={c.label}
                className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-card transition-all ${
                  color === c.key ? "ring-2 ring-ring scale-110" : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  background: `var(--orb-${c.key})`,
                  boxShadow: `0 0 18px color-mix(in oklab, var(--orb-${c.key}) 55%, transparent)`,
                }}
              />
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">Style</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(
              [
                { key: "classic", label: "Option A", sub: "Classique" },
                { key: "planetary", label: "Option B", sub: "Planétaire" },
              ] as const
            ).map((s) => (
              <button
                key={s.key}
                onClick={() => onStyleChange(s.key)}
                className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                  orbStyle === s.key
                    ? "border-ring bg-secondary text-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                <span className="block text-xs tracking-widest">{s.label}</span>
                <span className="block text-sm">{s.sub}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-9 border-t border-border pt-6">
          <h2 className="text-sm font-medium text-foreground">Navigation</h2>
          <div className="mt-3 space-y-2">
            <button
              onClick={() => onNavigate("tasks")}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              Mes projets et tâches
            </button>
            <button
              onClick={() => onNavigate("detox")}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Réduire les mauvaises habitudes
              <span className="ml-auto text-[10px] tracking-wider text-muted-foreground">
                DETOX
              </span>
            </button>
          </div>
        </section>
      </aside>
    </>
  );
}
