import jwt, { SignOptions, VerifyErrors, JwtPayload } from "jsonwebtoken";

type StringValue = `${number}${"s" | "m" | "h" | "d"}`;


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "JWT_ACCESS_SECRET or JWT_REFRESH_SECRET is not defined in environment variables"
  );
}

const signJwt = (
  payload: JwtPayload,
  secret: string,
  expiresIn: StringValue = "7d"
): string => {
  const options: SignOptions = { expiresIn, algorithm: "HS256" };
  return jwt.sign(payload, secret, options);
};

const verifyJwt = (token: string, secret: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });

    return decoded as JwtPayload;
  } catch (err) {
    const error = err as VerifyErrors;
    if (error.name === "TokenExpiredError")
      throw new Error("Token has expired");
    if (error.name === "JsonWebTokenError") throw new Error("Invalid token");
    throw new Error("Failed to verify token");
  }
};

export const signAccessToken = (
  payload: JwtPayload,
  expiresIn: StringValue = "1d"
): string => {
  return signJwt(payload, ACCESS_SECRET, expiresIn);
};

export const signRefreshToken = (
  payload: JwtPayload,
  expiresIn: StringValue = "7d"
): string => {
  return signJwt(payload, REFRESH_SECRET, expiresIn);
};

export const verifyAccessToken = (token: string): JwtPayload => {

  return verifyJwt(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token: string): JwtPayload => {
  return verifyJwt(token, REFRESH_SECRET);
};
