const express = require("express");

const router = express.Router();

const settingsController = require("../controllers/settingsController");
const verifyToken = require("../middleware/authMiddleware");

// =======================================
// Settings Routes
// =======================================

// GET User Settings
router.get(
    "/",
    verifyToken,
    settingsController.getSettings
);

// UPDATE User Settings
router.put(
    "/",
    verifyToken,
    settingsController.updateSettings
);

// DELETE User Settings
router.delete(
    "/",
    verifyToken,
    settingsController.deleteSettings
);

module.exports = router;