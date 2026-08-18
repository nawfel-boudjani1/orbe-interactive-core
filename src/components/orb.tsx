type OrbStyle = "classic" | "planetary";

interface OrbProps {
  color: string;
  style: OrbStyle;
}

export function Orb({ color, style }: OrbProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ ["--orb" as string]: `var(--orb-${color})` }}
    >
      <div
        className="absolute h-64 w-64 rounded-full blur-3xl opacity-40 animate-pulse"
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
        <div className="relative h-56 w-56 animate-orb-float">
          <div
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--orb) 85%, white), var(--orb) 60%, transparent 78%)",
              boxShadow: "0 0 80px 12px color-mix(in oklab, var(--orb) 60%, transparent)",
            }}
          />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border animate-orb-spin"
              style={{
                borderColor: "color-mix(in oklab, var(--orb) 45%, transparent)",
                transform: `rotateX(74deg) rotateZ(${i * 55}deg) scale(${1 - i * 0.16})`,
                animationDuration: `${9 + i * 4}s`,
                boxShadow: "0 0 24px color-mix(in oklab, var(--orb) 35%, transparent)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
