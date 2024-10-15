const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const router = require("./routers/index");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');

// Load environment variables from.env file
dotenv.config("./.env");

// Initialize Express app
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('common'));
app.use(cookieParser());

app.use('/api', router)
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// Connect to MongoDB
connectDB();

// Set up MongoDB connection
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is now running on port: ${PORT}`);
});
