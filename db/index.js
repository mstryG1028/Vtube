// this folder deals with database connectivity
// if we want to connect local mongodb then just change url

import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

const connectDb = async () => {
  try {
    const connInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(`\n MongoDb connected !! DB Host: ${connInstance.connection.host}`); // assignment
  } catch (err) {
    console.log("mogodb connection  failed:"+err); // aise type se likhenge to debugging me easy hota hai pta chalta hai kahan err hai just agar err print kra diya to hard ho jata hai
    process.exit(1); // used to terminate programm immediately code 0- success, 1-general err
    // here process is a object which have control on whole node js application and exit() is fn
  }
};

export default connectDb;