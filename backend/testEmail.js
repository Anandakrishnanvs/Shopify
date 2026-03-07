import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const testEmailConnection = async () => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.verify();
        console.log('Email connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('Email connection failed:', error);
        process.exit(1);
    }
};

testEmailConnection();
