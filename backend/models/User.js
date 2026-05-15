import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['employer', 'candidate'],
    required: true,
  },
  // Specific to employer
  companyName: { type: String },
  companyLogo: { type: String },
  companyWebsite: { type: String },
  companyDescription: { type: String },
  industryType: { type: String },

  // Specific to candidate
  phone: { type: String },
  profilePicture: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  currentRole: { type: String },
  preferredJobRole: { type: String },
  education: {
    collegeName: { type: String },
    degree: { type: String },
    specialization: { type: String },
    graduationYear: { type: Number }
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String }
  },
  resume: {
    data: Buffer,
    contentType: String,
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
