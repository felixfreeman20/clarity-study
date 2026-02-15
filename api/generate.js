export default async function handler(req, res) {
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { promptText } = body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: promptText }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // This sends the actual Groq error message to your screen
            return res.status(response.status).json({ error: data.error.message || "Groq Error" });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
