import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req, res) => {
    try {
        const {
            name, email, password, role,
            companyName, companyLogo, companyWebsite, companyDescription, industryType,
            phone, profilePicture, location, skills, experience, currentRole, preferredJobRole,
            education, socialLinks
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
        };

        if (role === 'employer') {
            Object.assign(userData, { companyName, companyLogo, companyWebsite, companyDescription, industryType });
        } else if (role === 'candidate') {
            Object.assign(userData, { phone, profilePicture, location, skills, experience, currentRole, preferredJobRole, education, socialLinks });
        }

        const user = await User.create(userData);

        if (user) {
            const userResponse = user.toObject();
            delete userResponse.password;
            if (userResponse.resume) {
                userResponse.hasResume = !!userResponse.resume.data;
                delete userResponse.resume;
            } else {
                userResponse.hasResume = false;
            }
            res.status(201).json({
                ...userResponse,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const userResponse = user.toObject();
            delete userResponse.password;
            if (userResponse.resume) {
                userResponse.hasResume = !!userResponse.resume.data;
                delete userResponse.resume;
            } else {
                userResponse.hasResume = false;
            }
            res.json({
                ...userResponse,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.resume = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
        await user.save();

        res.json({
            message: 'Resume uploaded successfully',
            hasResume: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getResume = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.resume || !user.resume.data) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.set('Content-Type', user.resume.contentType);
        // Instruct browser to display inline, fallback to download
        res.set('Content-Disposition', `inline; filename="${user.name}_resume.pdf"`);
        res.send(user.resume.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (user.role === 'employer') {
                user.companyName = req.body.companyName || user.companyName;
                user.companyLogo = req.body.companyLogo || user.companyLogo;
                user.companyWebsite = req.body.companyWebsite || user.companyWebsite;
                user.companyDescription = req.body.companyDescription || user.companyDescription;
                user.industryType = req.body.industryType || user.industryType;
            } else if (user.role === 'candidate') {
                user.phone = req.body.phone || user.phone;
                user.profilePicture = req.body.profilePicture || user.profilePicture;
                user.location = req.body.location || user.location;
                if (req.body.skills !== undefined) {
                    if (typeof req.body.skills === 'string') {
                        user.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (Array.isArray(req.body.skills)) {
                        user.skills = req.body.skills;
                    }
                }
                user.experience = req.body.experience || user.experience;
                user.currentRole = req.body.currentRole || user.currentRole;
                user.preferredJobRole = req.body.preferredJobRole || user.preferredJobRole;

                if (req.body.education) {
                    user.education = { ...user.education, ...req.body.education };
                }
                if (req.body.socialLinks) {
                    user.socialLinks = { ...user.socialLinks, ...req.body.socialLinks };
                }
            }

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            const userResponse = updatedUser.toObject();
            delete userResponse.password;
            if (userResponse.resume) {
                userResponse.hasResume = !!userResponse.resume.data;
                delete userResponse.resume;
            } else {
                userResponse.hasResume = false;
            }

            res.json({
                ...userResponse,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
