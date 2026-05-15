import express from 'express';
import { registerUser, loginUser, uploadResume, getUserProfile, getResume, updateUserProfile } from '../controllers/authController.js';
import { protect, candidateOnly, employerOnly } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-resume', protect, candidateOnly, upload.single('resume'), uploadResume);
router.get('/resume/:id', getResume);

export default router;
