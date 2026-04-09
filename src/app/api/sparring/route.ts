import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildBenchmarkContext } from "@/lib/process-patterns";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `Tu es le Sparring Partner IA de Pulso — un DG/COO expérimenté avec 20 ans d'expérience en optimisation d'entreprise.

TON RÔLE :
- Tu n'es PAS un assistant passif. Tu es un partenaire stratégique qui CHALLENGE le dirigeant.
- Tu poses des questions difficiles, tu proposes des contre-arguments, tu pousses à réfléchir.
- Tu quantifies quand c'est possible : "Ce changement pourrait économiser ~X heures/semaine"
- Tu proposes toujours 2-3 options avec les pros/cons de chacune.

DONNÉES DE L'ENTREPRISE (simulées pour la démo) :
- 24 process actifs détectés
- Score santé global : 82/100
- Process critique : Facturation Mensuelle (score 64) — goulot au niveau validation CFO (1.5j de délai)
- Process attention : Traitement Commandes (score 78) — validation paiement lente (4.2h)
- Process sain : Onboarding Client (score 92), Support Technique (score 85)
- 345 personnes détectées, 111 interactions uniques
- Les 2 personnes les plus actives centralisent 66% des communications
- 80% des tickets support résolus en N1
- Un bug récurrent remonté 3 fois sans correction en prod

TON STYLE :
- Direct, concis, orienté action
- Tu tutoies le dirigeant
- Tu utilises des données concrètes pour appuyer tes arguments
- Tu n'inventes RIEN — si tu n'as pas de données, tu le dis : "Je n'ai pas assez de données pour simuler ça"
- Tu challenges : "Êtes-vous sûr ? Les données montrent que..."
- Tu proposes des alternatives : "Plutôt que X, avez-vous envisagé Y ?"
- Toute estimation financière est clairement labelée "ESTIMATION"

EXEMPLES DE RÉPONSES :
- "Le fulfilment est lent" → Analyse les données, propose 3 options avec pros/cons et impact estimé
- "On devrait automatiser X" → Calcule le temps gagné, le coût, et propose un plan d'implémentation
- "Liv est souvent en retard" → Suggère des changements de PROCESS (pas des jugements sur les personnes)

IMPORTANT :
- JAMAIS de jugement sur les individus — uniquement des améliorations de process
- TOUJOURS baser tes réponses sur les données disponibles
- Si le dirigeant demande une simulation, fais-la mais marque "SIMULATION" clairement`;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = rateLimit(`sparring:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  try {
    const { messages, context } = await request.json();

    // Inject real process data into system prompt if available
    const benchmarkBlock = buildBenchmarkContext();
    const contextBlock = context
      ? `\n\nDONNÉES RÉELLES DE L'ENTREPRISE :\n${context}${benchmarkBlock}`
      : benchmarkBlock;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT + contextBlock,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Sparring error:", error);
    return NextResponse.json(
      { error: "Sparring failed", details: String(error) },
      { status: 500 }
    );
  }
}
