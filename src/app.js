// this file is used to configure all express configuration and define routes

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


//--------THESE ARE THE CONFIGURATION FOR EXPRESS-------------------

// app.use(cors());// (cross origin resourse sharing) aisa bhi karenge to ho jayega, but ye sab ko allow karta hai
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // this is called white-listing any port only this port can connect
    credentials: true, // this allow to send-receive (cookies,sessionId, auth-info etc)
  })
);

app.use(express.json({ limit: "16kb" })); // this allow to receive json data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // this is used to accept data from url
//app.use(express.urlencoded());// isme bhi kaam ho jaata hai
app.use(express.static("public")); // img,files wagere local server me store karne ke liye ( public is not necessary we can assign any name)
app.use(cookieParser());// used to send and accept cookies-data

//--------THESE ARE THE CONFIGURATION FOR EXPRESS END-------------------

//Routes import
//NOTE: we create diff routes for all diff schema for improving readability
// ex: for user we created userRouter so all routes related to user will consist in userRouter

import  userRouter from './routes/user.routes.js';

//Routes Declaration
// app.use("/users",userRouter); // jab bhi user "/user" pe jaayega to ye fn  directly userRouter ko control de dega
//  jiska logic router me likha hai ye bas req ko forward karne ka kaam karta hai
app.use("/api/v1/users",userRouter); // /api/v1/.... ye industry standard hai




export { app };
