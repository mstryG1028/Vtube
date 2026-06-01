
//require('dotenv').config(); this is valid but not maintains consistency bcz we are using module type

import dotenv from 'dotenv';
import connectDb from '../db/index.js';

dotenv.config({
    path:'/.env'
})

connectDb();














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
