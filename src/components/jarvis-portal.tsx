import { X } from "lucide-react";

interface JarvisPortalProps {
  color: string;
  open: boolean;
  onClose: () => void;
}

export function JarvisPortal({ color, open, onClose }: JarvisPortalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in"
      style={{ ["--orb" as string]: `var(--orb-${color})` }}
    >
      <button
        onClick={onClose}
        aria-label="Fermer JARVIS 3D"
        className="absolute right-5 top-6 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center gap-8">
        <div
          className="relative h-[22rem] w-[22rem] animate-scale-in"
          style={{ perspective: "900px", transformStyle: "preserve-3d" }}
        >
          {/* halo global */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-60 animate-pulse"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, var(--orb) 0%, color-mix(in oklab, var(--orb-accent) 60%, transparent) 45%, transparent 72%)",
            }}
          />

          {/* anneaux d'énergie profonds */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={`ring-${i}`}
              className="absolute inset-0"
              style={{
                transform: `rotateX(${74 - i * 7}deg) rotateZ(${i * 26}deg) scale(${1 - i * 0.085})`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={
                  i % 2 === 0 ? "h-full w-full animate-orb-spin" : "h-full w-full animate-orb-spin-rev"
                }
                style={{ animationDuration: `${7 + i * 2.5}s` }}
              >
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      i % 3 === 0
                        ? "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--orb-accent) 90%, white) 30deg, transparent 120deg, color-mix(in oklab, var(--orb) 70%, transparent) 220deg, transparent 320deg)"
                        : "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--orb) 90%, white) 45deg, transparent 140deg, color-mix(in oklab, var(--orb) 50%, transparent) 230deg, transparent 320deg)",
                    mask: "radial-gradient(circle, transparent 60%, black 64%, black 84%, transparent 88%)",
                    WebkitMask:
                      "radial-gradient(circle, transparent 60%, black 64%, black 84%, transparent 88%)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{
                    background: "color-mix(in oklab, var(--orb-accent) 30%, white)",
                    boxShadow: "0 0 16px 5px color-mix(in oklab, var(--orb-accent) 75%, transparent)",
                  }}
                />
              </div>
            </div>
          ))}

          {/* particules bleues + orange */}
          {Array.from({ length: 46 }).map((_, i) => {
            const angle = (i / 46) * Math.PI * 2;
            const radius = 30 + ((i * 29) % 26);
            const warm = i % 3 === 0;
            return (
              <span
                key={`particle-${i}`}
                className="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full animate-orb-twinkle"
                style={{
                  transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}%, ${
                    Math.sin(angle) * radius * 0.5
                  }%)`,
                  background: warm
                    ? "color-mix(in oklab, var(--orb-accent) 25%, white)"
                    : "color-mix(in oklab, var(--orb) 25%, white)",
                  boxShadow: `0 0 10px color-mix(in oklab, ${
                    warm ? "var(--orb-accent)" : "var(--orb)"
                  } 80%, transparent)`,
                  animationDelay: `${(i % 9) * 0.28}s`,
                }}
              />
            );
          })}

          {/* noyau */}
          <div
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full animate-orb-core"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, white 0%, color-mix(in oklab, var(--orb) 50%, white) 32%, var(--orb) 62%, transparent 80%)",
              boxShadow:
                "0 0 80px 22px color-mix(in oklab, var(--orb) 70%, transparent), 0 0 170px 60px color-mix(in oklab, var(--orb-accent) 40%, transparent)",
            }}
          />
        </div>

        <p className="text-[10px] tracking-[0.35em] text-muted-foreground">JARVIS 3D</p>
      </div>
    </div>
  );
}
