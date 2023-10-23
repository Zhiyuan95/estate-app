import User from "../modles/user.modle.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  //we use bcryptjs to help us hash the password
  const hasedPassword = bcryptjs.hashSync(password, 10);
  //this enable us save these info into db
  const newUser = new User({ username, password: hasedPassword, email });
  /*
    it is repeated if we use below method to send err message, as we need to add it for each
    controller everytime, so we can create a middleware to handle it, which should be declared in the index.js
  */
  try {
    // newUser.save() will take time depands on internet speed, so we should use asyc
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    //it shows error in insomnia rather than terminal
    // res.status(500).json(error.message);

    //we call that middeleware func
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //check if email exist in the db; use await as it takes time to search email in db
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    //as the password in db is hashed, we need to use compareSync method
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    /*
    use token and cookie to do user authentication, token can be tought of a ID card and cookie is the
    mechanism that saves and provide this ID card automatically 
    */
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    //remove password from va;idUser obj before server sending back user info and collect other data into rest obj
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //generate password
      const generatedPassword =
        Math.random().toString(32).slice(-8) +
        Math.random().toString(32).slice(-8);
      const hasedPassword = bcryptjs.hashSync(generatedPassword, 10);
      //create new user
      const newUser = new User({
        username:
          req.body.username.split(" ").join("").toLowerCase() +
          Math.random().toString(32).slice(-4),
        email: req.body.email,
        avatar: req.body.photo,
        password: hasedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
