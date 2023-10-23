import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import useRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.router.js";
import cookieParser from "cookie-parser";
dotenv.config();

/*
we store key in the .env as this file will be ignored while uploading to github or other public website
we need package dotenv to help us handle reading MONGO from .env file
*/
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cookieParser());

//this allows us to add ison as an input to server, as by default server doesn't receive any json
app.use(express.json());

//we use app.use to setup api route,and seperate them into route and controller files
app.use("/api/user", useRouter);
// app.get("/test", (req, res) => {
//   res.send("Welcome to ZANE estate");
// });
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

//here we create a middleware to handle err message
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000!!!");
});
