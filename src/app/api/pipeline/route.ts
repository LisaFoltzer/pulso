import { NextResponse } from "next/server";
import { rawEvents } from "@/lib/mock-emails";
import { runPipeline } from "@/lib/pipeline";

export async function POST() {
  // En production :
  // 1. Récupérer les events via Microsoft Graph API + Aircall API
  // 2. Appeler Claude Haiku pour le filtrage
  // 3. Appeler Claude Sonnet pour l'extraction sémantique
  // 4. Appeler Claude Sonnet en batch pour la détection de process
  //
  // Pour l'instant : simulation avec les données mock

  const result = runPipeline(rawEvents);

  return NextResponse.json(result);
}
