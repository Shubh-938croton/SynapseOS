const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Register User
router.post("/register", authController.registerUser);

// login 
router.post("/login", authController.loginUser);

module.exports = router;