import bcrypt from "bcryptjs";

const hashedPassword = "$2b$10$llLPOkOKmH5gHxOoHPvqM.wOOWbfdwoLowCBleenmrCp5BJZiyewS"; // your stored hash from DB
const passwordToTest = "admin123"; // the password you want to check

bcrypt.compare(passwordToTest, hashedPassword)
  .then(match => {
    console.log("Password match:", match); // true means passwords match, false means they don't
  })
  .catch(err => {
    console.error("Error comparing password:", err);
  });
