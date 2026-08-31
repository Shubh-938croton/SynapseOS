const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Register User
router.post("/register", authController.registerUser);

// Login 
router.post("/login", authController.loginUser);

// Google Sign-In / Register
router.post("/google", authController.googleLogin);

module.exports = router;