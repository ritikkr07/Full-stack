const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller.js");

const { protect, authorize } = require("../middleware/auth.middleware.js");

const router = express.Router();

// Apply protect to all routes (as users need to be logged in to see anything here)
router.use(protect);

// Apply authorize ONLY to the specific routes that require admin access.
// This is more scalable because if you add routes later that normal users 
// should access, they won't be blocked by a global authorize.

router.route("/")
  .get(authorize("admin", "superAdmin"), getUsers)
  .post(authorize("admin", "superAdmin"), createUser);

router.route("/:id")
  .get(authorize("admin", "superAdmin"), getUser)
  .put(authorize("admin", "superAdmin"), updateUser)
  .delete(authorize("admin", "superAdmin"), deleteUser);

module.exports = router;