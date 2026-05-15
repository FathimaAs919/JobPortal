import Job from '../models/Job.js';

export const createJob = async (req, res) => {
    try {
        const { title, role, location, salary, description, companyName, companyLogo, experience, skillsRequired, jobType, vacancies } = req.body;
        
        const job = new Job({
            title,
            role,
            location,
            salary,
            description,
            companyName,
            companyLogo,
            experience,
            skillsRequired,
            jobType,
            vacancies,
            employerId: req.user._id,
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getJobs = async (req, res) => {
    try {
        const { role, location, status } = req.query;
        let query = {};
        
        if (role) {
            query.role = { $regex: role, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (req.query.salary) {
            query.salary = { $regex: req.query.salary, $options: 'i' };
        }
        if (status) {
            query.status = status;
        } else {
            // default to open jobs for candidates
            query.status = 'Open'; 
        }

        const jobs = await Job.find(query).populate('employerId', 'name companyName').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employerId', 'name companyName');
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

export const getEmployerJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { title, role, location, salary, description, status, companyName, companyLogo, experience, skillsRequired, jobType, vacancies } = req.body;
        const job = await Job.findById(req.params.id);

        if (job) {
            if(job.employerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this job' });
            }
            
            job.title = title || job.title;
            job.role = role || job.role;
            job.location = location || job.location;
            job.salary = salary || job.salary;
            job.description = description || job.description;
            job.status = status || job.status;
            if (companyName) job.companyName = companyName;
            if (companyLogo) job.companyLogo = companyLogo;
            if (experience) job.experience = experience;
            if (skillsRequired) job.skillsRequired = skillsRequired;
            if (jobType) job.jobType = jobType;
            if (vacancies !== undefined) job.vacancies = vacancies;
            
            const updatedJob = await job.save();
            res.json(updatedJob);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
