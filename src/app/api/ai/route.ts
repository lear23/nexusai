import { NextRequest, NextResponse } from "next/server";

type Provider = "groq" | "ollama";

interface RequestBody {
  prompt: string;
  provider: Provider;
}

export async function POST(req: NextRequest) {
  const { prompt, provider }: RequestBody = await req.json();

  if (provider === "groq") {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await res.json();
    return NextResponse.json({
      text: data.choices?.[0]?.message?.content ?? ""
    });
  }

  if (provider === "ollama") {
    const res = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "llama3.1:8b",
        prompt,
        stream: false
      })
    });

    const data = await res.json();
    return NextResponse.json({
      text: data.response ?? ""
    });
  }

  return NextResponse.json({ error: "Proveedor inválido" }, { status: 400 });
}
