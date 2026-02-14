export default async function handler(req, res) {
  const { text, mode } = req.body;
  // Make sure your Vercel variable is named GROQ_API_KEY or update this line
  const apiKey = process.env.GROQ_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ result: "Error: Groq API Key missing in Vercel." });
  }

  const prompts = {
    summary: "Summarize these notes into a professional, structured study guide with bold headers and bullet points:",
    quiz: "Create a 3-question multiple choice quiz based on this text. Include the correct answers at the bottom.",
    speed: "Provide a 3-sentence high-pressure review of these notes for a student about to take an exam:"
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // This is Groq's best free-tier model
        messages: [
          { role: "system", content: "You are Clarity, a helpful and minimalist study assistant." },
          { role: "user", content: `${prompts[mode]}\n\n${text}` }
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).json({ result: data.choices[0].message.content });
    } else {
      console.error("Groq Error:", data);
      res.status(500).json({ result: "AI failed to generate. Check Groq limits." });
    }
  } catch (error) {
    res.status(500).json({ result: "Could not connect to the AI server." });
  }
}
