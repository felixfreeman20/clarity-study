export default async function handler(req, res) {
  const { text, mode } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ result: "AI Error: API Key missing in Vercel settings." });
  }

  // Custom instructions for each mode
  const prompts = {
    summary: "Transform these messy notes into a structured academic summary with bold headers and bullet points:",
    quiz: "Based on the text provided, create a multiple-choice quiz. Format it exactly like this:\n1. Question?\na) Option\nb) Option\nc) Option\n\nAnswer: [Letter]",
    speed: "Compress this content into the 3 most essential facts for an emergency review:"
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Clarity, a professional study assistant for students. You provide calm, structured, and accurate academic help." },
          { role: "user", content: `${prompts[mode]}\n\nText: ${text}` }
        ],
        temperature: 0.5 // Keeps the AI focused and professional
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ result: "The AI is currently unavailable." });
  }
}
