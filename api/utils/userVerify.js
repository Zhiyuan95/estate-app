import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  //when we sign in, we store token in cookies
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECERT, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    //after verifying, we can go to controller to update user info
    next();
  });
};
