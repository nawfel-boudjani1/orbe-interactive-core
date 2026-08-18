import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/speak")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "IA non configurée" }, { status: 500 });

        const body = (await request.json().catch(() => ({}))) as { text?: string };
        const text = (body.text ?? "").trim().slice(0, 1500);
        if (!text) return Response.json({ error: "Texte manquant" }, { status: 400 });

        const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: text,
            voice: "onyx",
            response_format: "mp3",
            instructions:
              "Voix masculine posée, chaleureuse et assurée, d'un assistant futuriste. Parle en français, débit calme.",
          }),
        });

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          return Response.json(
            { error: `Synthèse vocale échouée (${res.status}) ${detail.slice(0, 300)}` },
            { status: res.status },
          );
        }

        return new Response(res.body, { headers: { "Content-Type": "audio/mpeg" } });
      },
    },
  },
});
