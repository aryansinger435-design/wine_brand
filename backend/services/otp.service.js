import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
export function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (user && pass) {
    // If using Gmail, nodemailer service handles standard settings reliably
    if (host.includes("gmail.com")) {
      return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return null;
}

/**
 * Send OTP for Registration
 */
export async function sendRegistrationOTPEmail(email, otp) {
  const expiry = process.env.OTP_EXPIRY_MINUTES || 5;
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #0E0709; font-family: 'Georgia', serif; color: #F5EDE0; }
          .container { max-width: 600px; margin: 40px auto; background: #1B0B11; border: 1px solid #D4AF37; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.7); }
          .header { background: linear-gradient(135deg, #380C1B 0%, #17040B 100%); padding: 36px 20px; text-align: center; border-bottom: 2px solid #D4AF37; }
          .crest { font-size: 32px; color: #D4AF37; margin-bottom: 8px; }
          .brand-title { font-size: 26px; letter-spacing: 4px; color: #F5EDE0; margin: 0; text-transform: uppercase; font-weight: normal; }
          .subtitle { font-size: 13px; letter-spacing: 2px; color: #D4AF37; margin-top: 6px; text-transform: uppercase; }
          .content { padding: 40px 32px; text-align: center; }
          .greeting { font-size: 20px; color: #FFFFFF; margin-bottom: 16px; font-weight: normal; }
          .message { font-size: 15px; line-height: 1.6; color: #D8C7B8; margin-bottom: 28px; }
          .otp-box { background: #2D0F1B; border: 2px dashed #D4AF37; border-radius: 8px; padding: 18px 24px; display: inline-block; margin: 10px auto 25px; }
          .otp-code { font-size: 38px; font-family: 'Courier New', monospace; letter-spacing: 12px; color: #D4AF37; font-weight: bold; margin: 0; }
          .note { font-size: 13px; color: #A08C82; margin-top: 20px; }
          .footer { background: #120509; padding: 24px 20px; text-align: center; border-top: 1px solid #2F1722; font-size: 12px; color: #7B6862; }
          .footer p { margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="crest">🍷 ⚜️ 🍷</div>
            <h1 class="brand-title">Château Dhariwal</h1>
            <div class="subtitle">Fine Reserve & Cellars</div>
          </div>
          <div class="content">
            <h2 class="greeting">Welcome to Exclusive Cellar Privileges</h2>
            <p class="message">
              Thank you for registering with Château Dhariwal. Please enter the one-time verification code below to activate your connoisseur account:
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p class="message" style="margin-bottom: 0;">
              This code is valid for <strong>${expiry} minutes</strong>. Please do not share this confidential passcode with anyone.
            </p>
            <p class="note">If you did not initiate this registration request, please disregard this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Château Dhariwal Cellars Pvt. Ltd. All rights reserved.</p>
            <p>Crafted for fine taste. Please enjoy responsibly (18+ / 21+ only).</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "Château Dhariwal"}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Your Verification Code: ${otp} | Château Dhariwal`,
        text: `Your Château Dhariwal registration verification code is: ${otp}. Valid for ${expiry} minutes.`,
        html: htmlContent,
      });
      console.log(`[EMAIL DISPATCHED] Registration OTP successfully sent to ${email}`);
      return { delivered: true, method: "smtp" };
    } catch (smtpErr) {
      console.error("[SMTP ERROR] Failed to send via SMTP:", smtpErr.message);
      console.log(`\n======================================================`);
      console.log(`🍷 [DEV / FALLBACK] REGISTRATION OTP FOR: ${email}`);
      console.log(`🔐 OTP CODE (SERVER CONSOLE ONLY): >>> ${otp} <<<`);
      console.log(`⏰ EXPIRES IN: ${expiry} MINUTES`);
      console.log(`======================================================\n`);
      return { delivered: false, fallbackLogged: true, error: smtpErr.message };
    }
  } else {
    // Development / Local Mode: SMTP credentials not set yet in .env
    console.log(`\n======================================================`);
    console.log(`🍷 [DEV / LOCAL MODE] REGISTRATION OTP FOR: ${email}`);
    console.log(`🔐 OTP CODE (SERVER CONSOLE ONLY): >>> ${otp} <<<`);
    console.log(`⏰ EXPIRES IN: ${expiry} MINUTES`);
    console.log(`ℹ️ Add SMTP_USER and SMTP_PASS in .env to dispatch live emails to real inboxes`);
    console.log(`======================================================\n`);
    return { delivered: false, method: "dev-fallback", message: "SMTP credentials missing in .env" };
  }
}

/**
 * Send OTP for Password Reset
 */
export async function sendForgotPasswordOTPEmail(email, otp) {
  const expiry = process.env.OTP_EXPIRY_MINUTES || 5;
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #0E0709; font-family: 'Georgia', serif; color: #F5EDE0; }
          .container { max-width: 600px; margin: 40px auto; background: #1B0B11; border: 1px solid #D4AF37; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.7); }
          .header { background: linear-gradient(135deg, #380C1B 0%, #17040B 100%); padding: 36px 20px; text-align: center; border-bottom: 2px solid #D4AF37; }
          .crest { font-size: 32px; color: #D4AF37; margin-bottom: 8px; }
          .brand-title { font-size: 26px; letter-spacing: 4px; color: #F5EDE0; margin: 0; text-transform: uppercase; font-weight: normal; }
          .subtitle { font-size: 13px; letter-spacing: 2px; color: #D4AF37; margin-top: 6px; text-transform: uppercase; }
          .content { padding: 40px 32px; text-align: center; }
          .greeting { font-size: 20px; color: #FFFFFF; margin-bottom: 16px; font-weight: normal; }
          .message { font-size: 15px; line-height: 1.6; color: #D8C7B8; margin-bottom: 28px; }
          .otp-box { background: #2D0F1B; border: 2px dashed #D4AF37; border-radius: 8px; padding: 18px 24px; display: inline-block; margin: 10px auto 25px; }
          .otp-code { font-size: 38px; font-family: 'Courier New', monospace; letter-spacing: 12px; color: #E5C158; font-weight: bold; margin: 0; }
          .note { font-size: 13px; color: #A08C82; margin-top: 20px; }
          .footer { background: #120509; padding: 24px 20px; text-align: center; border-top: 1px solid #2F1722; font-size: 12px; color: #7B6862; }
          .footer p { margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="crest">🍷 ⚜️ 🍷</div>
            <h1 class="brand-title">Château Dhariwal</h1>
            <div class="subtitle">Password Recovery</div>
          </div>
          <div class="content">
            <h2 class="greeting">Reset Your Password</h2>
            <p class="message">
              We received a request to reset your password for Château Dhariwal. Enter this verification code to complete the reset:
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p class="message" style="margin-bottom: 0;">
              This code will expire in <strong>${expiry} minutes</strong>. If you did not request a password reset, you can safely ignore this email; your account remains secure.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Château Dhariwal Cellars Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "Château Dhariwal"}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Password Reset Code: ${otp} | Château Dhariwal`,
        text: `Your password reset code is: ${otp}. Valid for ${expiry} minutes.`,
        html: htmlContent,
      });
      console.log(`[EMAIL DISPATCHED] Forgot Password OTP sent to ${email}`);
      return { delivered: true, method: "smtp" };
    } catch (smtpErr) {
      console.error("[SMTP ERROR] Failed to send via SMTP:", smtpErr.message);
      console.log(`\n======================================================`);
      console.log(`🍷 [DEV / FALLBACK] FORGOT PASSWORD OTP FOR: ${email}`);
      console.log(`🔐 OTP CODE (SERVER CONSOLE ONLY): >>> ${otp} <<<`);
      console.log(`⏰ EXPIRES IN: ${expiry} MINUTES`);
      console.log(`======================================================\n`);
      return { delivered: false, fallbackLogged: true, error: smtpErr.message };
    }
  } else {
    console.log(`\n======================================================`);
    console.log(`🍷 [DEV / LOCAL MODE] FORGOT PASSWORD OTP FOR: ${email}`);
    console.log(`🔐 OTP CODE (SERVER CONSOLE ONLY): >>> ${otp} <<<`);
    console.log(`⏰ EXPIRES IN: ${expiry} MINUTES`);
    console.log(`ℹ️ Add SMTP_USER and SMTP_PASS in .env to dispatch live emails to real inboxes`);
    console.log(`======================================================\n`);
    return { delivered: false, method: "dev-fallback", message: "SMTP credentials missing in .env" };
  }
}
