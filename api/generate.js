// api/generate.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { promptText } = req.body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                // This is the key GitHub warned you about; it's safer here on the server
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { 
                        role: "system", 
                        content: "You are Clarity AI. Provide clear, structured study materials." 
                    },
                    { 
                        role: "user", 
                        content: promptText 
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        // Send the AI's answer back to your index.html
        res.status(200).json(data);

    } catch (error) {
        console.error("Bridge Error:", error);
        res.status(500).json({ error: "Failed to connect to Groq" });
    }
}
