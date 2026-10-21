exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Use POST for chat requests." }) };

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: "OPENROUTER_API_KEY is not configured in Netlify." }) };

  let input;
  try { input = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "Request body must be valid JSON." }) }; }

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (!message) return { statusCode: 400, headers, body: JSON.stringify({ error: "Please enter a message." }) };
  if (message.length > 12000) return { statusCode: 413, headers, body: JSON.stringify({ error: "Please shorten your message to 12,000 characters or fewer." }) };

  const tool = input.tool === "writer" ? "writer" : "chat";
  const style = typeof input.style === "string" ? input.style.slice(0, 40) : "Helpful";
  const system = tool === "writer"
    ? `You are the writing assistant inside Berry AI Studio. Create a useful, polished result. Style: ${style}.`
    : `You are Berry AI Studio, a friendly, helpful AI assistant. Respond clearly and accurately. Style: ${style}. If unsure, say so.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://berryaistudio.netlify.app",
        "X-Title": "Berry AI Studio"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "system", content: system }, { role: "user", content: message }],
        temperature: 0.7
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { statusCode: response.status === 429 ? 429 : 502, headers, body: JSON.stringify({ error: data?.error?.message || `AI provider returned status ${response.status}.` }) };
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) return { statusCode: 502, headers, body: JSON.stringify({ error: "The AI model returned no text. Please try again." }) };
    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };
  } catch {
    return { statusCode: 502, headers, body: JSON.stringify({ error: "Could not reach the AI provider. Please try again later." }) };
  }
};
