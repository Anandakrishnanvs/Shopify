import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root folder — same as server.js
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mongoose from 'mongoose';
import User from './models/userModel.js';

const run = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('URI:', process.env.MONGODB_URI ? 'Found ✅' : 'MISSING ❌');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        // Remove existing admin if any
        await User.deleteOne({ email: 'admin@gmail.com' });

        // Create fresh admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: 'admin123',
            role: 'admin',
        });

        console.log('✅ Admin created:', admin.email, '| role:', admin.role);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

run();
