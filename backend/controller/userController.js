import bcrypt from "bcrypt";
import users from "../model/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import sendEmail from "../lib/emailService.js";

// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const signup = async (req, res) => {
    try {
        const { fullName, email, password, profile, phone } = req.body;

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await users.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new users({
            fullName,
            email,
            phone,
            profile,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                phone: newUser.phone,
                profile: newUser.profile
            });
            const subject="Welcome Message";
            const text = `
Dear ${newUser.fullName},

Welcome to our community! We are delighted to have you join us and truly believe that your kindness and generosity will make you a valued partner in our journey. Together, we look forward to achieving great things and creating positive change.

Warm regards,
[Admins of CCA]
`;
        // sendEmail(newUser.email,subject,text);
        } else {
            
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signing up controller: " + error.message);
        res.status(500).json({ message: error.message });
        
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone
        });

    } catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: "Internal error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ message: "Internal error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profile } = req.body;
        const userId = req.user._id;
        if (!profile) {
            return res.status(404).json({ message: "Profile picture is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profile);
        const updateUser = await users.findByIdAndUpdate(userId, { profile: uploadResponse.secure_url }, { new: true });
        res.status(200).json(updateUser);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
