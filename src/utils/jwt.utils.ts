import jwt from "jsonwebtoken";
import config from "../../config";
import { UnAuthorizedError } from "./errors/appError.utils"; // Assuming the path to your error classes

const privateKey = config.rsaPrivateKey || "";
const publicKey = config.rsaPublicKey || "";

// Function to sign an object with JWT using the private key
export const signWithJWT = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  try {
    if (!privateKey || !privateKey.includes("-----BEGIN")) {
      throw new UnAuthorizedError(
        "Private key is not defined or is incorrectly formatted."
      );
    }

    // Sign the token using the private key and RS256 algorithm
    return jwt.sign(object, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
  } catch (error: any) {
    throw new UnAuthorizedError(`JWT Signing Error: ${error.message}`);
  }
};

// Function to verify the JWT using the public key
export const verifyJWT = (token: string) => {
  try {
    if (!publicKey || !publicKey.includes("-----BEGIN")) {
      throw new UnAuthorizedError(
        "Public key is not defined or is incorrectly formatted."
      );
    }

    // Verify the token using the public key
    const decoded = jwt.verify(token, publicKey);

    if (!decoded) throw new UnAuthorizedError("Invalid Token, (verify jwt)");

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    // Handle token expiration error
    if (error.name === "TokenExpiredError") {
      return {
        valid: false,
        expired: true,
        decoded: null,
      };
    }

    // Handle general JWT verification errors
    throw new UnAuthorizedError(`JWT Verification Error: ${error.message}`);
  }
};
