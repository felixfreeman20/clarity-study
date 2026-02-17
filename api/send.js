export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { email, code } = req.body;

  // This runs on Vercel's servers, so your password is never seen by users
  const response = await fetch('https://api.smtpjs.com/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'SecureToken': '', // We'll use direct login instead for reliability
      'Host': 'smtp.gmail.com',
      'Username': 'YOUR_GMAIL@gmail.com', 
      'Password': 'tzyg wscp mgmu zgt',
      'To': email,
      'From': 'YOUR_GMAIL@gmail.com',
      'Subject': `${code} is your Clarity code`,
      'Body': `<h1>Welcome to Clarity.</h1><p>Your verification code is: <b>${code}</b></p>`
    })
  });

  res.status(200).json({ sent: true });
}
