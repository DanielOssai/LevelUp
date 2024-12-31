require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema and Model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  level: Number,
  stats: {
    exp: Number,
    tokens: Number,
    nextLevelExp: Number,
  },
});
const User = mongoose.model("User", UserSchema);

// Routes
app.post("/createUser", async (req, res) => {
  const { username, email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({
    username,
    email,
    level: 1,
    stats: { exp: 0, tokens: 0, nextLevelExp: 100 },
  });
  await newUser.save();
  res.status(201).json({ message: "User created", user: newUser });
});

app.get("/getUsers", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.post("/updateUser", async (req, res) => {
  const { email, stats } = req.body;
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: { stats } },
    { new: true }
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User updated", user: updatedUser });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
