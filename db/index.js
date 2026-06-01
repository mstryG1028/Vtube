import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

const connectDb = async () => {
  try {
    const connInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(`\n MOngoDb connected !! DB Host: ${connInstance.connection.host}`); // assignment
  } catch (err) {
    console.log("mogodb con failed:"+err);
    process.exit(1); // assignment to read this
  }
};

export default connectDb;