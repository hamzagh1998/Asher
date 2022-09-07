import jwt  from "jsonwebtoken";

export function tokenGenerator(payload: object) {
  return jwt.sign(payload , process.env.SECRET_KEY!);
};