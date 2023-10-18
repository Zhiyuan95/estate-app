import User from "../modles/user.modle.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, password, email } = req.body;
  //we use bcryptjs to help us hash the password
  const hasedPassword = bcryptjs.hashSync(password, 10);

  //this enable us save these info into db
  const newUser = new User({ username, password: hasedPassword, email });
  // newUser.save() will take time depands on internet speed, so we should use asyc

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    //it shows error in insomnia rather than terminal
    res.status(500).json(error.message);
  }
};
