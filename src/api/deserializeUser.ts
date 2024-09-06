import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJWT } from "../utils/jwt.utils";
import { generateNewAccessToken } from "../utils/genToken.utils";
import { UnAuthorizedError } from "../utils/errors/appError.utils"; // Assuming this is where your custom errors are located

// deserializeUser function helps us to handle the incoming user, check its token
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // We are waiting for the access token from the headers (Bearer token) or from custom header
    const accessToken = get(req, "headers.authorization", "").replace(
      /^Bearer\s/,
      ""
    );
    const refreshToken = get(req, "headers.x-refresh") as string; // Custom header for refresh token
    // If no access token is present, proceed to the next middleware
    if (!accessToken) return next();

    // Extract information from the token and check expiration
    const { decoded, expired } = verifyJWT(accessToken);

    if (decoded) {
      // Assign the user data to res.locals.user
      res.locals.user = decoded;
      return next();
    }

    // If the access token expired but refresh token exists, generate new tokens
    if (refreshToken && expired) {
      // Generate a new access and refresh token
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await generateNewAccessToken(refreshToken);

      // Verify the new access token and assign user info to res.locals
      const result = verifyJWT(newAccessToken);
      res.locals.user = result?.decoded;

      // Send the new access and refresh tokens in the response headers
      res.setHeader("x-access-token", newAccessToken);
      res.setHeader("x-refresh-token", newRefreshToken);

      return next();
    }

    // If neither token is valid, throw an Unauthorized error
    throw new UnAuthorizedError("Access denied: No valid tokens provided");
  } catch (error: any) {
    // Pass the error to the centralized error handler
    return next(error);
  }
};
