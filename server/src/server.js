import express from "express";
import env from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";

//configure express app
const app = express();

//Middleware to parse json
app.use(express.json());

//configure env
env.config();
const PORT = process.env.PORT;

//Connect to MongoDatabase -- config file at /config/db.js
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

//Routes
app.use("/api/books", bookRoutes)
app.use("/api/auth", authRoutes)

// Start up server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});
