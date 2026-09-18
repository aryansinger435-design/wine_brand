import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.dburl);
    console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DATABASE ERROR] MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
