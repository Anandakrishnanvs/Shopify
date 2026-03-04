
import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
  updateUserProfile,
  deleteUserAccount,
  logoutUser,
  checkUser,
  checkAdmin,
} from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.get('/check-user', protect, checkUser);
router.get('/check-admin', protect, adminOnly, checkAdmin);
router
  .route('/profile')
  .get(protect, getMe)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);
router.get('/admin/profile', protect, adminOnly, getMe);
router.get('/user/profile', protect, getMe);

export default router;
