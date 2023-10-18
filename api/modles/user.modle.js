import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  //time stamps is to record 2 things; one is the time of creation of a user; another is the time of updating a user
  //later if we want to sort users, we can use these 2 infos
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
