require("dotenv").config();
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const { createToken } = require('../utils/jwtUtils');

const saltRounds = 10;

const crypto = require('crypto');

function encryptToken(token) {
    const cipher = crypto.createCipher('aes-256-ctr', process.env.ENCRYPTION_SECRET);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

module.exports = {
    login: async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        try {
            const userDoc = await User.findOne({ username });
            if (!userDoc) {
                return res.status(400).json({ message: "User not found" });
            }

            const passOk = await bcrypt.compare(password, userDoc.password);
            if (!passOk) {
                return res.status(400).json({ message: "Wrong credentials" });
            }

            const token = createToken(userDoc);
            const encryptedToken = encryptToken(token);

            res.cookie('token', encryptedToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000, // 1 hour
                path: '/'
            }).json({
                id: userDoc._id,
                username,
                token, 
                message: "Login successful"
            });

        } catch (err) {
            console.error("Login Error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    register: async (req, res) => {
        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await User.create({
                username,
                password: hashedPassword
            });

            res.status(201).json({
                id: newUser._id,
                username: newUser.username,
                message: "User registered successfully"
            });

        } catch (err) {
            console.error("Registration Error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    profile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (err) {
            console.error("Profile Error:", err);
            res.status(500).json({ message: "Error checking profile" });
        }
    },

    logout: (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        }).json({ message: "Logged out successfully" });
    }
};
