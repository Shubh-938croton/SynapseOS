const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

// Get logged-in user's profile
router.get("/profile", verifyToken, userController.getUserProfile);
router.put("/profile", verifyToken, userController.updateProfile);
router.put("/change-password", verifyToken, userController.changePassword);

module.exports = router;