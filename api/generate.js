// api/generate.js
export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // SAFETY CHECK: Handle both stringified and pre-parsed bodies
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
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: promptText }]
            })
        });

        const data = await response.json();
        
        // Return the actual AI response
        return res.status(200).json(data);

    } catch (error) {
        console.error("Function Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
