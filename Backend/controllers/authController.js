import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.name,
  email: user.email,
  role: user.role,
  location: user.location || "",
  resumeLink: user.resumeLink || "",
  gender: user.gender || "",
  createdAt: user.createdAt
});

// Register
export const register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const displayName = name?.trim() || username?.trim();

    if (!displayName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: displayName,
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      ...formatUserResponse(user),
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        ...formatUserResponse(user),
        token: generateToken(user._id)
      });
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  res.json(formatUserResponse(req.user));
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.username?.trim() || req.body.name?.trim() || user.name;
    user.email = req.body.email?.trim().toLowerCase() || user.email;
    user.location = req.body.location ?? user.location;
    user.resumeLink = req.body.resumeLink ?? user.resumeLink;
    user.gender = req.body.gender ?? user.gender;

    const updatedUser = await user.save();

    res.json(formatUserResponse(updatedUser));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
