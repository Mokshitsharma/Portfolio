import nodemailer from "nodemailer";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({ name, email, message }: ContactPayload): Promise<void> {
  if (!process.env.CONTACT_EMAIL_USER || !process.env.CONTACT_EMAIL_PASS) {
    throw new Error("Contact email credentials are not configured on the server.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_EMAIL_USER,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.CONTACT_EMAIL_USER,
    to: process.env.CONTACT_EMAIL_TO || process.env.CONTACT_EMAIL_USER,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
}
