import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import OtpSession from "../models/otp.model.js";
import { generateOTP, hashOTP } from "../utils/otp.js";
import {
  sendRegistrationOTPEmail,
  sendForgotPasswordOTPEmail,
} from "../services/otp.service.js";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
const MAX_OTP_ATTEMPTS = Number(process.env.MAX_OTP_ATTEMPTS) || 3;
const LOCK_MINUTES = Number(process.env.LOCK_MINUTES) || 15;
const RESEND_COOLDOWN_SECONDS =
  Number(process.env.RESEND_COOLDOWN_SECONDS) || 60;
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "super_secret_wine_brand_luxury_cellars_2026_jwt_token_secure";

/**
 * Register User (Step 1: Save unverified account & Send OTP)
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists. Please log in.",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (existingUser && !existingUser.isVerified) {
      // Update unverified user with new credentials
      existingUser.name = name.trim();
      existingUser.password = hashedPassword;
      await existingUser.save();
    } else {
      // Create new unverified user
      existingUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
      });
    }

    // Clear previous registration OTP sessions for this email
    await OtpSession.deleteMany({
      email: normalizedEmail,
      purpose: "registration",
    });

    // Generate fresh OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpSession.create({
      email: normalizedEmail,
      otpHash,
      purpose: "registration",
      expiresAt,
      lastSentAt: new Date(),
    });

    // Send email
    const mailResult = await sendRegistrationOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Please enter the 6-digit OTP to complete registration.`,
      email: normalizedEmail,
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Verify Registration OTP (Step 2: Activate account & Issue JWT)
 */
export async function verifyRegistrationOTP(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found. Please register first.",
      });
    }

    const session = await OtpSession.findOne({
      email: normalizedEmail,
      purpose: "registration",
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found. Please click 'Resend OTP'.",
      });
    }

    // Check lock
    if (session.lockedUntil && new Date(session.lockedUntil) > new Date()) {
      return res.status(423).json({
        success: false,
        message: `Too many failed attempts. Account temporarily locked for ${LOCK_MINUTES} minutes.`,
      });
    }

    // Check expiry
    if (new Date(session.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This OTP code has expired. Please request a new one.",
      });
    }

    // Compare hash
    const inputHash = hashOTP(otp.toString().trim());
    if (inputHash !== session.otpHash) {
      session.attempts += 1;
      if (session.attempts >= MAX_OTP_ATTEMPTS) {
        session.lockedUntil = new Date(
          Date.now() + LOCK_MINUTES * 60 * 1000
        );
        await session.save();
        return res.status(423).json({
          success: false,
          message:
            "Maximum attempts exceeded. This session is locked for 15 minutes.",
        });
      }
      await session.save();
      return res.status(400).json({
        success: false,
        message: `Invalid OTP code. ${MAX_OTP_ATTEMPTS - session.attempts} attempts remaining.`,
      });
    }

    // OTP is valid!
    user.isVerified = true;
    await user.save();

    // Clean up OTP sessions
    await OtpSession.deleteMany({
      email: normalizedEmail,
      purpose: "registration",
    });

    // Create JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to Château Dhariwal.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Resend OTP (with cooldown rate limiter)
 */
export async function resendOTP(req, res, next) {
  try {
    const { email, purpose = "registration" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to resend OTP.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Check previous session for cooldown
    const lastSession = await OtpSession.findOne({
      email: normalizedEmail,
      purpose,
    }).sort({ createdAt: -1 });

    if (lastSession && lastSession.lastSentAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(lastSession.lastSentAt).getTime()) / 1000
      );
      if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
        const remaining = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting another OTP.`,
          cooldownRemaining: remaining,
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Replace old OTP sessions
    await OtpSession.deleteMany({ email: normalizedEmail, purpose });

    await OtpSession.create({
      email: normalizedEmail,
      otpHash,
      purpose,
      expiresAt,
      lastSentAt: new Date(),
    });

    // Send email according to purpose
    if (purpose === "forgot_password") {
      await sendForgotPasswordOTPEmail(normalizedEmail, otp);
    } else {
      await sendRegistrationOTPEmail(normalizedEmail, otp);
    }

    return res.status(200).json({
      success: true,
      message: `A new verification code has been sent to ${normalizedEmail}.`,
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * User Login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if verified
    if (!user.isVerified) {
      // Send a fresh OTP to verify
      const otp = generateOTP();
      const otpHash = hashOTP(otp);
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      await OtpSession.deleteMany({
        email: normalizedEmail,
        purpose: "registration",
      });

      await OtpSession.create({
        email: normalizedEmail,
        otpHash,
        purpose: "registration",
        expiresAt,
        lastSentAt: new Date(),
      });

      await sendRegistrationOTPEmail(normalizedEmail, otp);

      return res.status(403).json({
        success: false,
        isUnverified: true,
        message:
          "Your email address is not verified yet. A verification OTP has been sent to your email.",
        email: normalizedEmail,
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Forgot Password - Send Reset Code
 */
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your registered email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No registered account found with this email address.",
      });
    }

    // Clean previous forgot_password sessions
    await OtpSession.deleteMany({
      email: normalizedEmail,
      purpose: "forgot_password",
    });

    // Generate OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await OtpSession.create({
      email: normalizedEmail,
      otpHash,
      purpose: "forgot_password",
      expiresAt,
      lastSentAt: new Date(),
    });

    // Send email
    await sendForgotPasswordOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: `Password reset OTP has been sent to ${normalizedEmail}.`,
      email: normalizedEmail,
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset Password with OTP
 */
export async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP code, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const session = await OtpSession.findOne({
      email: normalizedEmail,
      purpose: "forgot_password",
    }).sort({ createdAt: -1 });

    if (!session) {
      return res.status(400).json({
        success: false,
        message:
          "Reset code expired or not requested. Please request a new code.",
      });
    }

    // Check expiry
    if (new Date(session.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reset code has expired. Please request a new code.",
      });
    }

    // Check hash
    const inputHash = hashOTP(otp.toString().trim());
    if (inputHash !== session.otpHash) {
      session.attempts += 1;
      await session.save();
      return res.status(400).json({
        success: false,
        message: `Invalid reset code. ${MAX_OTP_ATTEMPTS - session.attempts} attempts remaining.`,
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isVerified = true; // password reset confirms email ownership
    await user.save();

    // Clear OTP sessions
    await OtpSession.deleteMany({
      email: normalizedEmail,
      purpose: "forgot_password",
    });

    return res.status(200).json({
      success: true,
      message:
        "Password has been reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Current User Profile
 */
export async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout
 */
export async function logout(req, res) {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}
