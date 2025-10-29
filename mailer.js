import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "Loaded ✅" : "Missing ❌");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter error:", error);
  } else {
    console.log("✅ Mailer ready");
  }
});


export const sendMail = async (to, subject, text) => {
  if (!to) throw new Error("No recipient email provided");

  try {
    const info = await transporter.sendMail({
      from: `"BrewFlow" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("📧 Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
};
