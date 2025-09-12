import mongoose from "mongoose";
import env from "dotenv";

env.config();
const DATABASE_URL = process.env.DATABASE_URL

//config mongoose
mongoose.connect(DATABASE_URL);
const db = mongoose.connection

export default db;

