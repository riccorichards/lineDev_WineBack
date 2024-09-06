import { get } from "lodash";
import { signWithJWT, verifyJWT } from "./jwt.utils";
import SessionModel from "../models/session";
import CustomerModel from "../models/customer";
import { NotFoundError, UnAuthorizedError } from "./errors/appError.utils"; // Importing centralized error

export const generateNewAccessToken = async (refreshToken: string) => {
  const { decoded, valid, expired } = verifyJWT(refreshToken);

  // Handle invalid refresh token
  if (!valid) {
    if (expired) {
      throw new UnAuthorizedError("Expired refresh token"); // Central error handling
    }
    throw new UnAuthorizedError("Invalid refresh token");
  }

  // Ensure the decoded refresh token contains a session
  if (!decoded || !get(decoded, "session")) {
    throw new UnAuthorizedError("Invalid session information in token");
  }

  // Find the session in the database
  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) {
    throw new UnAuthorizedError("Invalid session");
  }

  // Retrieve the user profile associated with the session
  const profile = await CustomerModel.findOne({ _id: session.user }).lean();

  if (!profile) {
    throw new NotFoundError("User not found");
  }

  // Create a new access token
  const accessToken = signWithJWT(
    { user: session.user, admin: profile.isAdmin, session: session._id },
    { expiresIn: 30 * 60 } // Expires in 30 minutes
  );
  // Create a new refresh token and invalidate the old one
  const newRefreshToken = signWithJWT(
    { user: session.user, admin: profile.isAdmin, session: session._id },
    { expiresIn: 24 * 60 * 60 } // Expires in one days
  );

  // Return both the new access token and the new refresh token
  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
