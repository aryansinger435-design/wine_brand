import express from "express";
import {
  register,
  verifyRegistrationOTP,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyRegistrationOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protectRoute, getMe);
router.post("/logout", logout);

export default router;
