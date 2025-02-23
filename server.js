const express = require("express");
const path = require("path");
const postsRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
const helmet = require('helmet');
app.use(helmet());

// Routes
app.use("/", postsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
