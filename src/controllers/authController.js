import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: { email },
    });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash: hashedPassword,
        },
    });

    // Generate JWT Token
    const token = generateToken(user.id.toString(), res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id.toString(),
                username: user.username,
                email: user.email,
            },
            token,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = generateToken(user.id.toString(), res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id.toString(),
                username: user.username,
                email: user.email,
            },
            token,
        },
    });
};

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "User logged out successfully",
    });
};

export { register, login, logout };