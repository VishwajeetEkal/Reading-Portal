const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const Message = require("../models/message_model");

// Socket.IO setup (make sure to import the 'server' instance from app.js)
const { app, server, io } = require("../app");
// Update the path as needed

// GET messages for a user
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization token found" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "mysecretkey170904");
    const user = await User.findById(decoded.userId);
    let withId = req.query.with;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (withId === "all") {
      const messages = await Message.find({
        participants: {
          $all: [{ $elemMatch: { type: user.role, userId: user._id } }],
        },
      })
        .populate("creator", "firstname")
        .populate("participants.userId", "firstname")
        .populate("timestamp")
        .exec();
      return res.json(messages);
    }
    if (!withId) {
      return res.status(400).json({ error: "No user ID provided" });
    }

    // Fetch messages between the two users
    const messages = await Message.find({
      participants: {
        $all: [
          { $elemMatch: { type: user.role, userId: user._id } },
          {
            $elemMatch: {
              //   type: user.role === "user" ? "owner" : "user",
              userId: withId,
            },
          },
        ],
      },
    })
      .populate("creator", "firstname role")
      .populate("participants.userId", "firstname")
      .exec();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred", message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization token found" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "mysecretkey170904");
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { participants, message } = req.body;

    if (!Array.isArray(participants) || participants.length < 1) {
      return res.status(400).json({ error: "Invalid participants array" });
    }

    const newMessage = new Message({
      creator: user._id,
      participants: [...participants, { type: user.role, userId: user._id }],
      message,
    });

    const savedMessage = await newMessage.save();

    // Emit a message event to all connected clients
    // io.emit('message', savedMessage);

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred", message: err.message });
  }
});

// get all users with whom the user has chatted
router.get("/allchats", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization token found" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "mysecretkey170904");
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await Message.find({
      participants: {
        $all: [{ $elemMatch: { type: user.role, userId: user._id } }],
      },
    })
      .populate("creator", "firstname role")
      .populate("participants.userId", "firstname role")
      .populate("timestamp")
      .exec();
    let users = [];
    messages.forEach((message) => {
      message.participants.forEach((participant) => {
        if (
          participant.userId._id.toString() !== user._id.toString() &&
          !users.includes(participant.userId)
        ) {
          users.push(participant.userId);
        }
      });
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error occurred", message: err.message });
  }
});

module.exports = router;
