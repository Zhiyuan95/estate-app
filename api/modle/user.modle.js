import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: string,
      required: true,
      unique: true,
    },
    email: {
      type: string,
      required: true,
      unique: true,
    },
    password: {
      type: string,
      required: true,
    },
  },
  //time stamps is to record 2 things; one is the time of creation of a user; another is the time of updating a user
  //later if we want to sort users, we can use these 2 infos
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
