import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import useRouter from "./routes/user.route.js";

dotenv.config();

//we store key in the .env as this file will be ignored while uploading to github or other public website
//we need package dotenv to help us handle reading MONGO from .env file
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//we use app.use to setup api route,and seperate them into route and controller files
app.use("/api/user", useRouter);

// app.get("/test", (req, res) => {
//   res.send("Welcome to ZANE estate");
// });

app.listen(3000, () => {
  console.log("server is running on port 3000!!!");
});
