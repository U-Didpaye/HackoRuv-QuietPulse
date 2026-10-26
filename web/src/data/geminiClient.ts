/**
 * QuietPulse Gemini Intelligence Service
 * Powers ChokasAI conversational intelligence and cognitive focus guidance.
 */

const geminiApiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim() || '';

export const isGeminiConfigured: boolean = Boolean(
  geminiApiKey &&
  !geminiApiKey.includes('your-') &&
  geminiApiKey.length > 10
);

export interface ChatHistoryEntry {
  sender: 'chokas' | 'user';
  text: string;
}

const SYSTEM_INSTRUCTION = `You are ChokasAI, the intelligent attention management, focus copilot, and notification strategist for QuietPulse (The Attention Firewall).
QuietPulse is a privacy-first attention firewall and focus system designed under the mantra "LESS NOISE. MORE FOCUS."
Core features of QuietPulse:
- NotiFy: Real-time notification airlock and decision engine evaluating independent Urgency (time decay) and Relevance (contextual) heuristics.
- FlowQueue: Intelligent batching buffer where non-urgent, promotional, and social alerts are quarantined for scheduled batch digests.
- DeepFocus: Pomodoro and deep work distraction blocker with customizable intervals and soundscapes.
- PulseInsights: Privacy-preserving cognitive telemetry showing deflected interruptions and attention analytics.
- Context Modes: Exactly 3 modes: Office (prioritizes work alerts & team pings), Home (prioritizes personal & family contacts), and Personalized Mode (tunable thresholds and VIP contacts).
- Sovereign Privacy: Notification inspection occurs 100% on-device; notification payloads are never uploaded or sold.

Guidelines:
- Maintain a concise, thoughtful, calm, and highly knowledgeable tone.
- When users ask about focus, burnout, distraction, notification overload, or habits, provide clear, actionable insights.
- Emphasize QuietPulse's privacy-first values. Keep responses concise and formatted with clean paragraphs or bullet points.`;

/**
 * Generates an AI response using the Google Gemini REST API.
 */
export async function askGemini(
  prompt: string,
  history: ChatHistoryEntry[] = []
): Promise<string> {
  if (!isGeminiConfigured) {
    throw new Error('Gemini API key is not configured.');
  }

  // Format conversational context into Gemini's multi-turn schema
  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood. I am ChokasAI, your QuietPulse attention copilot. I am ready to guide focus, explain triage heuristics, and help eliminate notification anxiety." }]
    }
  ];

  // Append recent chat history (last 6 turns to keep prompt tight and fast)
  const recentHistory = history.slice(-6);
  for (const entry of recentHistory) {
    contents.push({
      role: entry.sender === 'user' ? 'user' : 'model',
      parts: [{ text: entry.text }]
    });
  }

  // Append current prompt
  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
            topP: 0.95
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini API call to ${model} returned ${response.status}:`, errorText);
        continue; // Try next candidate model
      }

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (replyText && typeof replyText === 'string') {
        return replyText.trim();
      }
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        console.warn(`Gemini API call to ${model} timed out.`);
      } else {
        console.warn(`Gemini API error on ${model}:`, err);
      }
    }
  }

  throw new Error('All Gemini model endpoints failed or were unreachable.');
}
