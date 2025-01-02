import jwt from "jsonwebtoken";
import dt from "dotenv";
import bcrypt from "bcrypt";

dt.config();

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
}

export async function verifyPassword(inputPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(inputPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error while matching password", error.message);
    return false;
  }
}

export async function hashPassword(inputPassword) {
  try {
    const hashedValue = await bcrypt.hash(inputPassword, 10);
    return hashedValue;
  } catch (error) {
    console.error("Error hashing password", error.message);
    return null;
  }
}
