
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from './data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import User from './models/userModel.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config({ path: path.join(__dirname, '../.env') });

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    // Map frontend ids to MongoDB documents
    const createdProducts = await Product.insertMany(products.map(({ id, ...rest }) => rest));

    // Create default admin user (password: admin123)
    await User.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Default admin: admin@gmail.com / admin123');

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
