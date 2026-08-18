type OrbStyle = "classic" | "planetary";

interface OrbProps {
  color: string;
  style: OrbStyle;
  active?: boolean;
}

export function Orb({ color, style, active = false }: OrbProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ ["--orb" as string]: `var(--orb-${color})` }}
    >
      <div
        className={`absolute h-64 w-64 rounded-full blur-3xl transition-opacity duration-500 ${
          active ? "opacity-70 animate-pulse" : "opacity-40"
        }`}
        style={{ background: "var(--orb)" }}
      />

      {style === "classic" ? (
        <div className="relative h-56 w-56 rounded-full animate-orb-float">
          <div
            className="absolute inset-0 rounded-full opacity-90"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--orb) 90%, white) 0%, var(--orb) 35%, transparent 72%)",
              boxShadow: "0 0 90px 10px color-mix(in oklab, var(--orb) 55%, transparent)",
            }}
          />
          <div
            className="absolute inset-6 rounded-full opacity-70 animate-orb-spin"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, color-mix(in oklab, var(--orb) 70%, transparent), transparent 70%)",
            }}
          />
          <div
            className="absolute inset-20 rounded-full blur-md"
            style={{ background: "color-mix(in oklab, var(--orb) 25%, white)" }}
          />
        </div>
      ) : (
        <div
          className="relative h-64 w-64 animate-orb-float"
          style={{ perspective: "700px", transformStyle: "preserve-3d" }}
        >
          {/* halo interne */}
          <div
            className="absolute inset-8 rounded-full blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--orb) 80%, white), transparent 70%)",
            }}
          />

          {/* disques d'énergie inclinés */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`disc-${i}`}
              className="absolute inset-0"
              style={{
                transform: `rotateX(${68 - i * 6}deg) rotateZ(${i * 34}deg) scale(${1 - i * 0.11})`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={i % 2 === 0 ? "h-full w-full animate-orb-spin" : "h-full w-full animate-orb-spin-rev"}
                style={{ animationDuration: `${8 + i * 3}s` }}
              >
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--orb) 85%, white) 40deg, transparent 130deg, color-mix(in oklab, var(--orb) 55%, transparent) 210deg, transparent 300deg)",
                    mask: "radial-gradient(circle, transparent 62%, black 66%, black 82%, transparent 86%)",
                    WebkitMask:
                      "radial-gradient(circle, transparent 62%, black 66%, black 82%, transparent 86%)",
                    filter: "blur(0.4px)",
                  }}
                />
                {/* satellite sur l'anneau */}
                <div
                  className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                  style={{
                    background: "color-mix(in oklab, var(--orb) 30%, white)",
                    boxShadow: "0 0 12px 3px color-mix(in oklab, var(--orb) 70%, transparent)",
                  }}
                />
              </div>
            </div>
          ))}

          {/* anneau vertical fin */}
          <div
            className="absolute inset-4 animate-orb-spin"
            style={{ animationDuration: "22s", transform: "rotateY(72deg)" }}
          >
            <div
              className="h-full w-full rounded-full border"
              style={{
                borderColor: "color-mix(in oklab, var(--orb) 40%, transparent)",
                boxShadow: "0 0 22px color-mix(in oklab, var(--orb) 40%, transparent)",
              }}
            />
          </div>

          {/* particules */}
          {Array.from({ length: 22 }).map((_, i) => {
            const angle = (i / 22) * Math.PI * 2;
            const radius = 34 + ((i * 37) % 18);
            return (
              <span
                key={`p-${i}`}
                className="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full animate-orb-twinkle"
                style={{
                  transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}%, ${
                    Math.sin(angle) * radius * 0.42
                  }%)`,
                  background: "color-mix(in oklab, var(--orb) 25%, white)",
                  boxShadow: "0 0 8px color-mix(in oklab, var(--orb) 80%, transparent)",
                  animationDelay: `${(i % 7) * 0.3}s`,
                }}
              />
            );
          })}

          {/* noyau */}
          <div
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full animate-orb-core"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, white 0%, color-mix(in oklab, var(--orb) 55%, white) 30%, var(--orb) 60%, transparent 78%)",
              boxShadow:
                "0 0 60px 16px color-mix(in oklab, var(--orb) 70%, transparent), 0 0 140px 40px color-mix(in oklab, var(--orb) 35%, transparent)",
            }}
          />
        </div>
      )}
    </div>
  );
}
