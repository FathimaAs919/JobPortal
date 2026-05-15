import express from 'express';
import { applyForJob, getCandidateApplications, getJobApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, candidateOnly, employerOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, candidateOnly, applyForJob);
router.get('/candidate', protect, candidateOnly, getCandidateApplications);
router.get('/job/:jobId', protect, employerOnly, getJobApplications);
router.put('/:id/status', protect, employerOnly, updateApplicationStatus);

export default router;
