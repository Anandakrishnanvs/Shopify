import sendWelcomeEmail from './utils/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();

const testSend = async () => {
    try {
        console.log('Attempting to send welcome email...');
        const success = await sendWelcomeEmail('shopifyy31@gmail.com', 'Test User');
        if (success) {
            console.log('Test email sent successfully!');
            process.exit(0);
        } else {
            console.log('Test email failed but did not throw an error.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Email testing crashed:', error);
        process.exit(1);
    }
};

testSend();
