const express = require('express')
const router = express.Router();
const User = require('../models/User')

router.post("/register", async (req, res) => {
    const { fullName, email, role, firebase_uid } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const newUser = new User({ fullName, email, role, firebase_uid });
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  router.get("/:firebase_uid", async (req, res) => {
    try {
      const user = await User.findOne({ firebase_uid: req.params.firebase_uid });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  module.exports = router;