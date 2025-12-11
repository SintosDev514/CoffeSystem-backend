import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const DEFAULT_FROM = process.env.EMAIL_FROM || process.env.GMAIL_USER || "no-reply@localhost";

if (SENDGRID_API_KEY) {
  // Use SendGrid Web API for reliable delivery from cloud hosts
  import("@sendgrid/mail").then((sg) => {
    const sgMail = sg.default;
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log("✅ SendGrid configured");
  }).catch((err) => {
    console.error("❌ Failed to import @sendgrid/mail:", err.message);
  });
} else {
  console.log("No SENDGRID_API_KEY found — falling back to SMTP transporter");
}

let transporter = null;
const setupSmtp = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = (process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS;

  console.log("SMTP config:", { host, port, secure, user: !!user });

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
  });

  transporter.verify((error) => {
    if (error) {
      console.error("Transporter verify error:", error.message || error);
    } else {
      console.log("✅ SMTP transporter ready");
    }
  });

  return transporter;
};

export const sendMail = async (to, subject, text) => {
  if (!to) throw new Error("No recipient email provided");

  if (SENDGRID_API_KEY) {
    try {
      const sg = await import("@sendgrid/mail");
      const sgMail = sg.default;
      sgMail.setApiKey(SENDGRID_API_KEY);

      const msg = {
        to,
        from: DEFAULT_FROM,
        subject,
        text,
      };

      const result = await sgMail.send(msg);
      console.log("📧 SendGrid email sent");
      return result;
    } catch (err) {
      console.error("❌ SendGrid send failed:", err.message || err);
      throw err;
    }
  }

  // Fallback to SMTP
  try {
    const t = setupSmtp();
    const info = await t.sendMail({
      from: `"BrewFlow" <${DEFAULT_FROM}>`,
      to,
      subject,
      text,
    });

    console.log("📧 SMTP Email sent:", info?.response || info);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err.message || err);
    throw err;
  }
};
