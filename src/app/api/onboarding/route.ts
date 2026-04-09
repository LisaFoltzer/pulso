import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Tu es Pulso, un assistant IA spécialisé dans l'audit des process d'entreprise. Tu conduis un entretien de découverte avec un nouveau client pour comprendre son entreprise.

TON STYLE :
- Tu parles comme dans un meeting Teams : naturel, pro mais détendu
- Tu poses UNE question à la fois, jamais plus
- Tu rebondis sur les réponses du client, tu montres que tu as compris
- Tu fais des liens entre les réponses ("Ah intéressant, ça rejoint ce que tu disais sur...")
- Tu es concis : 2-3 phrases max par message
- Tu tutoies

CE QUE TU DOIS DÉCOUVRIR (pas forcément dans cet ordre, adapte-toi) :
- Le secteur d'activité et ce que fait l'entreprise
- La taille de l'équipe et les principaux départements
- Les outils de communication utilisés (email, Teams, Slack, téléphone...)
- Les process clés qui font tourner la boîte
- Les points de friction et frustrations actuelles
- Ce qu'ils espèrent améliorer

RÈGLES :
- Ne pose JAMAIS une question qui a déjà été répondue
- Sois naturel, pas robotique
- Si le client donne une réponse courte, relance avec une sous-question pertinente
- Après 6-8 échanges, fais un résumé de ce que tu as compris et propose de passer à l'étape suivante (connexion des sources)
- Commence par te présenter brièvement et poser ta première question`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; text: string }) => ({
        role: m.role,
        content: m.text,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Check if the conversation seems to be wrapping up
    const isComplete = messages.length >= 14 ||
      text.toLowerCase().includes("connecter") ||
      text.toLowerCase().includes("passer à l'étape") ||
      text.toLowerCase().includes("sources de données");

    return NextResponse.json({ text, isComplete });
  } catch (error) {
    console.error("Onboarding chat error:", error);
    return NextResponse.json(
      { error: "Chat failed", details: String(error) },
      { status: 500 }
    );
  }
}
