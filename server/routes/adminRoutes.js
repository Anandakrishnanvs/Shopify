import express from 'express';
const router = express.Router();
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUserByAdmin,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

// All routes are protected and admin-only
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUserByAdmin);

export default router;
