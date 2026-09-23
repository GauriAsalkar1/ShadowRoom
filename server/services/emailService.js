const nodemailer = require('nodemailer');

// Create transporter with better configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Add this for better debugging
  debug: true,
  logger: true
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email server connection error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: '"ShadowRoom" <noreply@shadowroom.com>',
    to: email,
    subject: 'Verify Your Email - ShadowRoom',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎭 ShadowRoom</h1>
            <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0;">Welcome to the anonymous community</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Thanks for joining ShadowRoom! To complete your registration and start sharing anonymously, 
              please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">Verify Email Address</a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; color: #666; border: 1px solid #e9ecef;">
              ${verificationUrl}
            </p>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
              This verification link will expire in 24 hours. If you didn't create an account on ShadowRoom, 
              you can safely ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              ShadowRoom - Speak freely, stay anonymous<br>
              © 2026 ShadowRoom. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    // Plain text version for email clients that don't support HTML
    text: `
      Welcome to ShadowRoom!
      
      Please verify your email address by clicking this link:
      ${verificationUrl}
      
      This link expires in 24 hours.
      
      If you didn't create an account, please ignore this email.
      
      - ShadowRoom Team
    `
  };

  try {
    console.log(`📧 Attempting to send email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Detailed email error:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: '"ShadowRoom" <noreply@shadowroom.com>',
    to: email,
    subject: 'Reset Your Password - ShadowRoom',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `
      Password Reset Request
      
      Click this link to reset your password:
      ${resetUrl}
      
      This link expires in 1 hour.
      
      If you didn't request this, please ignore this email.
    `
  };

  try {
    console.log(`📧 Sending password reset email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Password reset email error:', error);
    throw error;
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };