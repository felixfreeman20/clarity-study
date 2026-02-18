export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { email, code } = req.body;

    // Log this to your Vercel console so you can see if the function actually fires
    console.log(`Attempting to send code ${code} to ${email}`);

    try {
        const response = await fetch('https://api.smtpjs.com/v1/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'SecureToken': 'YOUR_SMTPJS_TOKEN', // If you have a token, use it here
                'To': email,
                'From': 'YOUR_GMAIL@gmail.com', // Your Gmail
                'Subject': `${code} is your Clarity Code`,
                'Body': `Welcome! Your verification code is ${code}`,
                'Host': 'smtp.gmail.com',
                'Username': 'YOUR_GMAIL@gmail.com', // Your Gmail
                'Password': 'xxxx xxxx xxxx xxxx' // 16-character APP PASSWORD
            })
        });

        const result = await response.text();
        console.log("SMTPJS Result:", result); // Look for "OK" in Vercel logs
        res.status(200).json({ success: true, info: result });
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: err.message });
    }
}
