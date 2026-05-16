import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Building } from 'lucide-react';

const JobCard = ({ job, isEmployer }) => {
    return (
        <div className="glass-card job-card">

            {/* HEADER */}
            <div className="job-card-header">
                <div className="job-card-title">

                    <h3>{job?.title || 'Untitled Job'}</h3>

                    <div className="job-card-company">
                        <Building size={16} />
                        <span>
                            {job?.employerId?.companyName || 'Company Name Not Available'}
                        </span>
                    </div>
                </div>

                <span
                    className={`job-card-badge ${
                        job?.status?.toLowerCase() === 'open' ? 'open' : 'closed'
                    }`}
                >
                    {job?.status || 'Closed'}
                </span>
            </div>

            {/* META INFO */}
            <div className="job-card-meta">

                <div className="job-card-meta-item">
                    <MapPin size={16} />
                    <span>{job?.location || 'Not specified'}</span>
                </div>

                <div className="job-card-meta-item">
                    <DollarSign size={16} />
                    <span>{job?.salary || 'Not disclosed'}</span>
                </div>

            </div>

            {/* ACTION BUTTON */}
            {isEmployer ? (
                <Link
                    to={`/employer/job/${job?._id}`}
                    className="btn btn-primary"
                >
                    Manage Job
                </Link>
            ) : (
                <Link
                    to={`/jobs/${job?._id}`}
                    className="btn btn-primary"
                >
                    View Details
                </Link>
            )}

        </div>
    );
};

export default JobCard;