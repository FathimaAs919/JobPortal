import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { sendStatusUpdateEmail } from '../utils/emailService.js';

export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const candidate = await User.findById(req.user._id);
        if (!candidate.resume) {
            return res.status(400).json({ message: 'Please upload a resume before applying' });
        }

        const exactApplication = await Application.findOne({ jobId, candidateId: req.user._id });
        if (exactApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = new Application({
            jobId,
            candidateId: req.user._id,
            resume: candidate.resume,
        });

        const createdApplication = await application.save();
        res.status(201).json(createdApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCandidateApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidateId: req.user._id })
            .populate({
                path: 'jobId',
                populate: { path: 'employerId', select: 'companyName' }
            })
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employerId.toString() !== req.user._id.toString()) {
             return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('candidateId', 'name email resume')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('candidateId')
            .populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.jobId.employerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = status;
        const updatedApplication = await application.save();

        // Send Email notification mock
        sendStatusUpdateEmail(application.candidateId.email, application.jobId.title, status);

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
