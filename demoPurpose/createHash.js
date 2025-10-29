import bcrypt from "bcryptjs";

async function createHash() {
  const password = "admin123";  // choose your new password here
  const hashed = await bcrypt.hash(password, 10);
  console.log("New hashed password:", hashed);
}

createHash();
