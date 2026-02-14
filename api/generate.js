export default async function handler(req, res) {
  const { text, mode, count } = req.body;
  const apiKey = process.env.GROQ_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ result: "Error: AI Key missing in Vercel." });
  }

  // Logic to handle question count for Quiz Mode
  const quizPrompt = `Create exactly ${count || 5} multiple choice questions based on this text. 
                      Format: 
                      1. [Question]
                      a) [Option]
                      b) [Option]
                      c) [Option]
                      Answer: [Letter]`;

  const prompts = {
    summary: "Summarize these notes into a professional, structured study guide with bold headers and bullet points:",
    quiz: quizPrompt,
    speed: "Provide a 3-sentence high-pressure review of these notes for an exam:"
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are Clarity, a helpful and minimalist study assistant." },
          { role: "user", content: `${prompts[mode]}\n\nText: ${text}` }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ result: data.choices[0].message.content });
    } else {
      res.status(500).json({ result: "AI failed to generate. Check Groq limits." });
    }
  } catch (error) {
    res.status(500).json({ result: "Could not connect to the AI server." });
  }
}
