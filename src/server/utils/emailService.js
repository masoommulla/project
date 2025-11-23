import SibApiV3Sdk from '@getbrevo/brevo';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configure API key from environment variables
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Get sender configuration from environment variables
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@zenmind.app';
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'ZenMind Team';

/**
 * Send Welcome Email to new users
 * 
 * IMPORTANT: Before this works, you MUST:
 * 1. Add your Brevo API key to .env file as BREVO_API_KEY
 * 2. Verify your sender email in Brevo Dashboard: https://app.brevo.com/settings/senders
 * 3. Update BREVO_SENDER_EMAIL in .env to match your verified email
 */
export async function sendWelcomeEmail(userEmail, userName) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Welcome to ZenMind 🌿 - Your Mental Wellness Journey Starts Here!";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #3b82f6; text-align: center;">Welcome to ZenMind, ${userName} 🌿</h2>

        <p>
          We're truly glad to have you join <strong>ZenMind</strong> — a supportive space created to help teens understand,
          manage, and improve their mental well-being.  
        </p>

        <p>
          Your journey toward clarity, emotional balance, and peace starts here. With ZenMind, you now have access to:
        </p>

        <ul>
          <li>💬 A confidential AI-powered chatbot to support you 24/7</li>
          <li>🧠 Mood tracking to understand emotional patterns</li>
          <li>📝 Journaling tools to express your thoughts safely</li>
          <li>📌 Personalized mental health suggestions</li>
          <li>👩‍⚕️ Access to licensed therapists for private therapy sessions</li>
        </ul>

        <p>
          Remember, taking care of your mental health is a strength — and we're here to help you at every step.  
        </p>

        <h3 style="color: #3b82f6;">Need support?</h3>
        <p>
          📧 Email: <a href="mailto:support@zenmind.com">support@zenmind.com</a><br>
          📞 Contact: +91 0123456789
        </p>

        <p>
          Feel free to explore, learn, and grow. We're excited to be part of your journey.
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Warm regards,<br>
          <span style="color: #3b82f6;">Team ZenMind</span>
        </p>

      </div>
    </div>
  `;
  
  // Sender configuration from environment variables
  sendSmtpEmail.sender = { 
    name: SENDER_NAME, 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome email sent successfully to:', userEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}

/**
 * Send OTP Email for Password Reset
 */
export async function sendOtpEmail(userEmail, userName, otp) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Your ZenMind Password Reset OTP 🔐";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #3b82f6; text-align: center;">Password Reset Request 🔐</h2>

        <p>Hi ${userName},</p>

        <p>
          We received a request to reset your ZenMind password. Use the following OTP to proceed:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <h1 style="color: #3b82f6; background: #e0f2fe; padding: 20px; border-radius: 10px; display: inline-block; letter-spacing: 5px;">
            ${otp}
          </h1>
        </div>

        <p style="color: #dc2626; font-weight: bold;">
          ⏰ This OTP is valid for <strong>10 minutes</strong> only.
        </p>

        <p>
          If you didn't request a password reset, please ignore this email or contact us immediately.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

        <p style="font-size: 12px; color: #64748b;">
          For security reasons, never share your OTP with anyone. ZenMind will never ask for your OTP via phone or social media.
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Stay safe,<br>
          <span style="color: #3b82f6;">Team ZenMind</span>
        </p>

      </div>
    </div>
  `;
  
  // CRITICAL: You MUST verify this sender email in Brevo Dashboard
  sendSmtpEmail.sender = { 
    name: "ZenMind Security", 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ OTP email sent successfully to:', userEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}