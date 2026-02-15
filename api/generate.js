export default async function handler(req, res) {
    // Body is often pre-parsed in Vercel
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
    res.status(200).json(data);
}
