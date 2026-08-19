import { Loader2, Mic, Square, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { startRecording } from "@/lib/voice-recorder";

export interface JarvisItem {
  title: string;
  meta: string;
}

export interface StressAnalysis {
  level: number;
  summary: string;
}

export type JarvisStatus = "idle" | "listening" | "thinking" | "speaking";

interface JarvisConsoleProps {
  onConfirmTasks: (items: JarvisItem[]) => void;
  onConfirmDetox: (items: JarvisItem[]) => void;
  onStress: (s: StressAnalysis) => void;
  status: JarvisStatus;
  onStatusChange: (s: JarvisStatus) => void;
}

interface Turn {
  role: "user" | "assistant";
  content: string;
}

export function JarvisConsole({
  onConfirmTasks,
  onConfirmDetox,
  onStress,
  status,
  onStatusChange,
}: JarvisConsoleProps) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pendingAction, setPendingAction] = useState<{ tasks: JarvisItem[]; detox: JarvisItem[] } | null>(null);
  const recorder = useRef<{ stop: () => Promise<Blob> } | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const label =
    status === "listening"
      ? "JARVIS VOUS ÉCOUTE…"
      : status === "thinking"
        ? "JARVIS RÉFLÉCHIT…"
        : status === "speaking"
          ? "JARVIS VOUS RÉPOND…"
          : "APPUYEZ POUR PARLER À JARVIS";

  const speak = async (text: string) => {
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audio.current?.pause();
      const el = new Audio(url);
      audio.current = el;
      onStatusChange("speaking");
      el.onended = () => {
        onStatusChange("idle");
        URL.revokeObjectURL(url);
      };
      await el.play();
    } catch {
      onStatusChange("idle");
      toast.error("La voix de JARVIS est indisponible, mais sa réponse est affichée.");
    }
  };

  const sendToJarvis = async (text: string) => {
    const history: Turn[] = [...turns, { role: "user", content: text }];
    setTurns(history);
    onStatusChange("thinking");
    try {
      const res = await fetch("/api/jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = (await res.json()) as {
        reply?: string;
        proposedTasks?: JarvisItem[];
        proposedDetox?: JarvisItem[];
        stress?: StressAnalysis | null;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Erreur");

      const reply = data.reply?.trim() || "Je n'ai pas bien saisi, pouvez-vous répéter ?";
      setTurns([...history, { role: "assistant", content: reply }]);
      const pTasks = data.proposedTasks ?? [];
      const pDetox = data.proposedDetox ?? [];
      if (pTasks.length || pDetox.length) setPendingAction({ tasks: pTasks, detox: pDetox });
      if (data.stress && typeof data.stress.level === "number") onStress(data.stress);
      await speak(reply);
    } catch (e) {
      onStatusChange("idle");
      toast.error(e instanceof Error ? e.message : "JARVIS est injoignable.");
    }
  };

  const toggleMic = async () => {
    if (status === "listening") {
      const rec = recorder.current;
      recorder.current = null;
      onStatusChange("thinking");
      try {
        const blob = await rec!.stop();
        const form = new FormData();
        form.append("file", blob, "recording.wav");
        const res = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = (await res.json()) as { text?: string; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Transcription échouée");
        const text = data.text?.trim();
        if (!text) {
          onStatusChange("idle");
          toast.error("Je n'ai rien entendu, réessayez.");
          return;
        }
        await sendToJarvis(text);
      } catch (e) {
        onStatusChange("idle");
        toast.error(e instanceof Error ? e.message : "Micro indisponible.");
      }
      return;
    }

    if (status !== "idle") return;
    try {
      recorder.current = await startRecording();
      onStatusChange("listening");
    } catch {
      toast.error("Accès au micro refusé.");
    }
  };

  const busy = status === "thinking" || status === "speaking";

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      {turns.length > 0 && (
        <div className="max-h-40 w-full space-y-2 overflow-y-auto">
          {turns.slice(-4).map((t, i) => (
            <div
              key={`${i}-${t.content.slice(0, 12)}`}
              className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  t.role === "user"
                    ? "bg-secondary text-foreground"
                    : "border border-border bg-card text-foreground"
                }`}
              >
                {t.role === "assistant" && (
                  <Volume2 className="mr-2 inline h-3.5 w-3.5 text-muted-foreground" />
                )}
                {t.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {pending && (pending.tasks.length > 0 || pending.detox.length > 0) && (
        <div className="w-full rounded-3xl border border-border bg-card p-4">
          <p className="text-[10px] tracking-[0.25em] text-muted-foreground">
            PROPOSITION DE JARVIS
          </p>
          <ul className="mt-3 space-y-2">
            {[...pending.tasks, ...pending.detox].map((item) => (
              <li key={item.title} className="text-sm text-foreground">
                • {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs text-muted-foreground">{item.meta}</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                if (pending.tasks.length) onTasks(pending.tasks);
                if (pending.detox.length) onDetox(pending.detox);
                setPending(null);
                toast.success("Ajouté par JARVIS.");
              }}
              className="flex-1 rounded-full border border-ring bg-secondary px-4 py-2 text-xs tracking-[0.14em] text-foreground"
            >
              OUI, AJOUTE
            </button>
            <button
              onClick={() => setPending(null)}
              className="flex-1 rounded-full border border-border px-4 py-2 text-xs tracking-[0.14em] text-muted-foreground"
            >
              NON MERCI
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleMic}
        disabled={busy}
        aria-label="Parler à JARVIS"
        className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all disabled:opacity-70 ${
          status === "listening"
            ? "border-ring bg-secondary text-foreground scale-110 animate-pulse"
            : "border-border text-muted-foreground hover:bg-secondary/60"
        }`}
      >
        {status === "listening" ? (
          <Square className="h-4 w-4" />
        ) : busy ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>
      <span className="text-[10px] tracking-[0.3em] text-muted-foreground">{label}</span>
    </div>
  );
}
