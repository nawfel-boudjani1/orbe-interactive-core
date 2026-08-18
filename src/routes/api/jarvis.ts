import { createFileRoute } from "@tanstack/react-router";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM = `Tu es JARVIS, un assistant vocal masculin, chaleureux, concis et motivant, qui parle FRANÇAIS.
Tu aides l'utilisateur à organiser sa journée (projets, tâches, habitudes) et à réduire ses mauvaises habitudes (dopamine detox).
Tu prends aussi des nouvelles de son moral et évalues son niveau de stress quand c'est pertinent.

Réponds TOUJOURS uniquement avec un objet JSON valide, sans texte autour, sans balises markdown, de cette forme :
{
  "reply": "ta réponse parlée, 1 à 3 phrases maximum, naturelle, à l'oral",
  "tasks": [{ "title": "titre court", "meta": "Projet · 30 min" }],
  "detox": [{ "title": "titre court", "meta": "Substitution suggérée" }],
  "stress": { "level": 42, "summary": "une phrase d'analyse" } | null
}
- "tasks" : seulement les NOUVELLES tâches à ajouter à la liste (vide si aucune).
- "detox" : seulement les nouvelles règles/habitudes à réduire (vide si aucune).
- "stress" : un niveau de 0 à 100 uniquement si l'utilisateur a parlé de son état/moral, sinon null.
- Si l'utilisateur te décrit ses tâches, crée-les et confirme-les brièvement à l'oral.
- Si tu ne sais pas comment il va, demande-le lui gentiment.`;

export const Route = createFileRoute("/api/jarvis")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return Response.json({ error: "IA non configurée" }, { status: 500 });
        }

        let body: { messages?: ChatTurn[] };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Requête invalide" }, { status: 400 });
        }
        const history = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
        if (history.length === 0) {
          return Response.json({ error: "Aucun message" }, { status: 400 });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "google/gemini-3.7-flash",
            messages: [{ role: "system", content: SYSTEM }, ...history],
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          return Response.json(
            { error: `JARVIS indisponible (${res.status}) ${text.slice(0, 300)}` },
            { status: res.status },
          );
        }

        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const raw = data.choices?.[0]?.message?.content ?? "";
        const cleaned = raw
          .trim()
          .replace(/^```(?:json)?/i, "")
          .replace(/```$/, "")
          .trim();

        try {
          const parsed = JSON.parse(cleaned);
          return Response.json({
            reply: typeof parsed.reply === "string" ? parsed.reply : cleaned,
            tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
            detox: Array.isArray(parsed.detox) ? parsed.detox : [],
            stress: parsed.stress ?? null,
          });
        } catch {
          return Response.json({ reply: cleaned, tasks: [], detox: [], stress: null });
        }
      },
    },
  },
});
