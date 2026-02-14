export default async function handler(req, res) {
  const { text, mode } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ result: "Error: No OpenAI Key found in Vercel settings." });
  }

  const prompts = {
    summary: "Summarize this into clear bullet points for a student:",
    quiz: "Create a 3-question quiz with answers based on this:",
    speed: "Provide a 3-sentence ultra-fast review of this:"
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
        messages: [{ role: "user", content: `${prompts[mode]}\n\n${text}` }]
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ result: "AI error occurred." });
  }
}
