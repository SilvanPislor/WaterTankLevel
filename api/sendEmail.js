// /api/sendEmail.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { to, subject, text } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'EAST SIDE TANKS <onboarding@resend.dev>'
      to,
      subject,
      text,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
