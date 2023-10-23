import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../modles/user.modle.js";

export const test = (req, res) => {
  res.send("Welcome to ZANE estate");
};

export const userUpdate = async (req, res, next) => {
  if (req.user.id !== req.param.id)
    return next(errorHandler(401, "You're not allowed to update this account"));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.param.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
