const express = require('express');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/getdetails', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send('No authorization token found');
        }
        const token = authHeader.split(' ')[1]; 
        const decoded = jwt.verify(token, 'mysecretkey170904');

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred: ' + err.message);
    }
});

router.put('/updatedetails', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send('Authorization token not found');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'mysecretkey170904');
        const userId = decoded.userId;

        // Assuming the request body directly contains the fields to be updated
        const updatedUserData = req.body;

        // Find the user by ID and update their data
        const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred: ' + err.message);
    }
});

module.exports = router;
