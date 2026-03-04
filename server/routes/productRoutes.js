
import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, sellerOnly } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getProducts)
  .post(protect, sellerOnly, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, sellerOnly, updateProduct)
  .delete(protect, sellerOnly, deleteProduct);

export default router;
