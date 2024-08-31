const express = require("express");
const {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout
} = require("../controller/userController");
const router = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

// LOGIN REGISTER
router.post("/register", createUser);
router.post("/login", loginUser);

// UPDATE USER
router.put("/:id", authMiddleware, updateUser);

// GET USER
router.get("/all-user", getAllUser);
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/:id', authMiddleware, isAdmin, getUser)

// /DELETE USER
router.delete("/:id", deleteUser);

// BLOCK USER
router.put("/block-user/:id", authMiddleware, isAdmin,blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin,unBlockUser);



module.exports = router;
