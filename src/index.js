
//require('dotenv').config(); only this single line is valid but not maintains consistency
//  bcz we are using module type

// isliye ye itna tamjham karna pada hai
import dotenv from 'dotenv';
import connectDb from '../db/index.js';
import app from './app.js'

dotenv.config({
    path:'/.env'
})

connectDb()
.then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log(`Listening at:${process.env.PORT}`)
  })
})
.catch((err)=>{
console.log("MongoDb connection Failed !!!", err);
})














/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express();

// this is called as ifis in this we dont neet to call fn, it automatically called
// (()=>{})(); syntax // assignment


(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    app.on("error", (err) => {
      console.log(err);
      throw err;
    });
    app.listen(process.env.PORT, () => {
      console.log(`Listening at:${process.env.PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
})();
*/
