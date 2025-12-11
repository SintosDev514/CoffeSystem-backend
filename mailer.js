import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

let resend = null;
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
  console.log("✅ Resend configured");
} else {
  console.warn("⚠️  RESEND_API_KEY not found — emails will fail");
}

export const sendMail = async (to, subject, text) => {
  if (!to) throw new Error("No recipient email provided");

  if (!resend) {
    throw new Error("Resend is not configured (missing RESEND_API_KEY)");
  }

  try {
    const result = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      text,
    });

    if (result.error) {
      console.error("❌ Resend send failed:", result.error);
      throw new Error(result.error.message);
    }

    console.log("📧 Resend email sent:", result.data?.id);
    return result;
  } catch (err) {
    console.error("❌ Email send failed:", err.message || err);
    throw err;
  }
};
