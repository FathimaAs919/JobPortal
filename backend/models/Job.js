import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true, // E.g., "$80,000 - $100,000"
  },
  description: {
    type: String,
    required: true,
  },
  companyName: String,
  companyLogo: String,
  experience: String,
  skillsRequired: [String],
  jobType: String,
  vacancies: Number,
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
