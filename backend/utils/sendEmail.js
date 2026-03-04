import nodemailer from 'nodemailer';

const sendWelcomeEmail = async (userEmail, userName) => {
    // Check if email credentials are provided and not placeholders
    const isConfigured = 
        process.env.EMAIL_USER && 
        process.env.EMAIL_PASS && 
        process.env.EMAIL_USER !== 'your_email@gmail.com' &&
        process.env.EMAIL_PASS !== 'your_app_password';

    if (!isConfigured) {
        console.warn('EMAIL SERVICE WARNING: Email credentials are not configured in .env file.');
        console.warn('Skipping welcome email for %s. To enable, update EMAIL_USER and EMAIL_PASS in server/.env', userEmail);
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Shopify" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Welcome to Shopify!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">Shopify</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
            <h2 style="color: #2c3e50;">Welcome, ${userName}!</h2>
            <p>Thank you for registering with our store. We are thrilled to have you on board!</p>
            <p>Start exploring our latest collections and find the best deals today. Our store offers a wide variety of clothing for Men, Women, and Kids.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #e67e22; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping Now</a>
            </div>
            <p>If you have any questions, feel free to reply to this email.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>The Shopify Team</strong></p>
          </div>
          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>&copy; 2026 Shopify Store. All rights reserved.</p>
          </div>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to %s: %s', userEmail, info.messageId);
        return true;
    } catch (error) {
        console.error('CRITICAL ERROR sending welcome email to %s:', userEmail);
        
        if (error.code === 'EAUTH' && error.message.includes('Application-specific password required')) {
            console.error('GMAIL AUTH ERROR: Your account has 2-Factor Authentication enabled.');
            console.error('ACTION REQUIRED: Please generate an "App Password" from your Google Account settings and use it as EMAIL_PASS.');
            console.error('See: https://support.google.com/mail/?p=InvalidSecondFactor');
        } else if (error.code === 'EAUTH') {
            console.error('AUTHENTICATION ERROR: Incorrect EMAIL_USER or EMAIL_PASS.');
        } else {
            console.error('Error Details:', {
                name: error.name,
                message: error.message,
                code: error.code,
                command: error.command
            });
        }
        return false;
    }
};

export default sendWelcomeEmail;
