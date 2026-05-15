import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Building } from 'lucide-react';

const JobCard = ({ job, isEmployer }) => {
    return (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                        <Building size={16} />
                        <span>{job.employerId?.companyName || 'Company'}</span>
                    </div>
                </div>
                <span style={{ 
                    background: job.status === 'Open' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                    color: job.status === 'Open' ? 'var(--secondary)' : 'var(--error)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                }}>
                    {job.status}
                </span>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    <MapPin size={16} />
                    <span>{job.location}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    <DollarSign size={16} />
                    <span>{job.salary}</span>
                </div>
            </div>

            {isEmployer ? (
                <Link to={`/employer/job/${job._id}`} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>Manage Job</Link>
            ) : (
                <Link to={`/jobs/${job._id}`} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>View Details</Link>
            )}
        </div>
    );
};

export default JobCard;
