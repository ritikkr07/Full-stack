const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/auth.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", protect, getMe);

module.exports = router;
