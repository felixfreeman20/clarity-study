// api/generate.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        
        const { promptText } = body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // CHANGED: Using a supported model
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { role: "system", content: "You are Clarity AI. Provide clear, structured study materials." },
                    { role: "user", content: promptText }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || "Groq Error" });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Function Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
