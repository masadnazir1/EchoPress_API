const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // Import v4 for UUID generation
const { OAuth2Client } = require("google-auth-library"); // Use require() instead of import

//
const { createUser, getUserByEmail } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; // store securely in .env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER Controller
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const newUuid = uuidv4(); // Generate UUID
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user"; // Default role
    const userId = await createUser({
      newUuid,
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", userId });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// LOGIN Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Optionally, set cookie here if using HTTP-only cookies
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Google Authentication Handler
const googleAuth = async (req, res) => {
  const { token } = req.body; // token sent from the frontend

  try {
    if (!token) {
      return res.status(400).json({ error: "Google token is required" });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure the audience matches your Google Client ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.log("picture", picture);

    // Check if the user exists in the database
    let user = await getUserByEmail(email);

    // If the user doesn't exist, create a new user
    if (!user) {
      const newUuid = uuidv4(); // Generate UUID for the new user
      const role = "user"; // Default role

      // Create new user in the database (without password as it's Google auth)
      const password = `GoogleLogin@${newUuid}%${name}`; // use correct key
      user = await createUser({
        newUuid,
        name,
        email,
        picture,
        password,
        role,
      });
    }

    // Generate a JWT token for the authenticated user
    const jwtToken = jwt.sign(
      {
        id: user.id,
        name: name,
        email: user.email,
        role: user.role,
        pic: picture,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({ message: "Login successful", token: jwtToken });
  } catch (err) {
    console.error("Google Auth error:", err);
    return res
      .status(500)
      .json({ error: "Failed to authenticate with Google" });
  }
};

module.exports = { registerUser, loginUser, googleAuth };
