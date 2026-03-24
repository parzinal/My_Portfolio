import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(1200),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000)
      })
    )
    .max(10)
    .optional()
});

const SYSTEM_PROMPT = `You are KimDev K'Ai Assistant, a smart AI embedded in Kim Yamamoto's portfolio website.

## About Kim Yamamoto
- Future Software Engineer based in Calauan, Laguna, Philippines
- Studies at PUP Calauan Campus
- Email: yamamotokim4@gmail.com
- GitHub: github.com/parzinal
- Status: Open to opportunities and client projects
- Specializes in PHP, Laravel, Python, Django, MySQL, JavaScript, TypeScript, React, Next.js, Tailwind CSS
- Tools: GitHub, VS Code, Laragon

## Kim's Projects
- CABMS - Multi-branch role-based system for animal bite incidents, patient records, vaccination schedules, and follow-ups
- TB5 Payroll System - Employee salary and timekeeping management
- Kpokedex - Pokemon-style collection system
- Sipa Game - Arcade/mini game project
- Pogs Game - Game system project
- CleanMoto - Service booking and operations management for helmet/cleaning services

## Services Kim Offers
- Web Development (responsive websites and web apps)
- Backend Development (Laravel, Django, PHP, Python)
- System Development (management systems, tracking tools, service workflows)

## Your Behavior Rules
1. If the user asks about Kim, his portfolio, projects, skills, services, or how to hire him, answer using the info above.
2. If the user asks something unrelated to Kim's portfolio or identity, politely refuse and redirect them to portfolio topics.
3. Always be friendly, concise, and helpful.
4. If asked who you are, say you are KimDev K'Ai Assistant, powered by Gemini, embedded in Kim Yamamoto's portfolio.
5. Never make up project details not listed above.`;

const PORTFOLIO_SCOPE_KEYWORDS = [
  "kim",
  "yamamoto",
  "who am i",
  "who is kim",
  "portfolio",
  "project",
  "cabms",
  "tb5",
  "kpokedex",
  "sipa",
  "pogs",
  "cleanmoto",
  "skill",
  "stack",
  "technology",
  "tech",
  "service",
  "offer",
  "hire",
  "contact",
  "email",
  "github",
  "experience",
  "education",
  "pup",
  "calauan",
  "laguna",
  "future software engineer"
];

function getOutOfScopeReply() {
  return "I can only answer questions about Kim Yamamoto and his portfolio. Please ask about his background, skills, projects, services, or contact details.";
}

function getWhoAmIReply() {
  return "You are Kim Yamamoto, a future software engineer from Calauan, Laguna, Philippines, currently studying at PUP Calauan Campus. You specialize in PHP, Laravel, Python, Django, MySQL, JavaScript, TypeScript, React, Next.js, and Tailwind CSS.";
}

function isPortfolioRelated(message: string, history?: Array<{ content: string }>) {
  const contextText = [
    ...(history || []).slice(-4).map((item) => item.content),
    message
  ]
    .join(" ")
    .toLowerCase();

  return PORTFOLIO_SCOPE_KEYWORDS.some((keyword) => contextText.includes(keyword));
}

function getFallbackReply(message: string) {
  const q = message.toLowerCase();

  if (q.includes("who are you") || q.includes("your name")) {
    return "I am KimDev K'Ai Assistant, embedded in Kim Yamamoto's portfolio. I can answer questions about Kim, his projects, services, and how to contact him.";
  }

  if (q.includes("who is kim") || q.includes("about kim") || q.includes("introduce kim")) {
    return "Kim Yamamoto is a future software engineer from Calauan, Laguna, Philippines, currently studying at PUP Calauan Campus. He builds web and system projects using Laravel, Django, React, Next.js, PHP, Python, and MySQL.";
  }

  if (q.includes("contact") || q.includes("hire") || q.includes("email")) {
    return "You can contact Kim at yamamotokim4@gmail.com. He is open to opportunities and client projects.";
  }

  if (q.includes("project")) {
    return "Kim's featured projects include CABMS, TB5 Payroll System, Kpokedex, Sipa Game, Pogs Game, and CleanMoto. If you want, I can summarize any one of them.";
  }

  if (q.includes("service") || q.includes("offer")) {
    return "Kim offers Web Development, Backend Development, and System Development services for business and management workflows.";
  }

  return "I can help with Kim's portfolio details. Ask about his skills, projects, services, education, or contact information.";
}

function buildDebugInfo(extra: Record<string, unknown> = {}) {
  return {
    nodeEnv: process.env.NODE_ENV || "unknown",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    configuredModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    ...extra
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const parsed = chatSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat payload", debug: buildDebugInfo({ reason: "invalid_payload" }) },
        { status: 400 }
      );
    }

    const normalizedMessage = parsed.data.message.trim().toLowerCase();
    if (normalizedMessage === "who am i" || normalizedMessage === "who am i?") {
      return NextResponse.json(
        { reply: getWhoAmIReply(), debug: buildDebugInfo({ reason: "who_am_i_shortcut" }) },
        { status: 200 }
      );
    }

    if (!isPortfolioRelated(parsed.data.message, parsed.data.history)) {
      return NextResponse.json(
        {
          reply: getOutOfScopeReply(),
          outOfScope: true,
          debug: buildDebugInfo({ reason: "out_of_scope_filter" })
        },
        { status: 200 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured",
          debug: buildDebugInfo({ reason: "missing_api_key" })
        },
        { status: 503 }
      );
    }

    const geminiContents = (parsed.data.history || []).map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }]
    }));

    const modelCandidates = [
      process.env.GEMINI_MODEL || "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    let response: Response | null = null;
    let responseText = "";
    const attemptedModels: string[] = [];
    let usedModel: string | null = null;

    for (const model of modelCandidates) {
      attemptedModels.push(model);
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [...geminiContents, { role: "user", parts: [{ text: parsed.data.message }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 800
        }
      })
        }
      );

      if (response.ok) {
        usedModel = model;
        break;
      }

      responseText = await response.text();
      if (response.status !== 404) {
        break;
      }
    }

    if (!response) {
      return NextResponse.json(
        {
          error: "Gemini request did not execute",
          debug: buildDebugInfo({ reason: "no_provider_response", attemptedModels })
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      const providerError = responseText || (await response.text());
      const providerErrorLower = providerError.toLowerCase();

      if (providerErrorLower.includes("quota") || providerErrorLower.includes("billing")) {
        return NextResponse.json(
          {
            reply: getFallbackReply(parsed.data.message),
            fallback: true,
            warning: "Gemini quota/billing issue detected. Using fallback assistant response.",
            debug: buildDebugInfo({
              reason: "provider_quota_or_billing",
              attemptedModels,
              providerStatus: response.status
            })
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          reply: getFallbackReply(parsed.data.message),
          fallback: true,
          warning: `Gemini API request failed (${response.status}). Using fallback assistant response.`,
          providerStatus: response.status,
          providerError: providerError.slice(0, 500),
          debug: buildDebugInfo({
            reason: "provider_request_failed",
            attemptedModels,
            providerStatus: response.status
          })
        },
        { status: 200 }
      );
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a reply.";

    return NextResponse.json({
      reply,
      debug: buildDebugInfo({ reason: "provider_success", attemptedModels, usedModel })
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error", debug: buildDebugInfo({ reason: "unexpected_exception" }) },
      { status: 500 }
    );
  }
}
