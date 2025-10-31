import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRE: string = process.env.JWT_EXPIRE || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
