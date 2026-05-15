import express from 'express';
import { createJob, getJobs, getJobById, getEmployerJobs, updateJob } from '../controllers/jobController.js';
import { protect, employerOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(protect, employerOnly, createJob);

router.get('/employer', protect, employerOnly, getEmployerJobs);

router.route('/:id')
    .get(getJobById)
    .put(protect, employerOnly, updateJob);

export default router;
