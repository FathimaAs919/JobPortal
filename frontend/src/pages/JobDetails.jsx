import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { MapPin, DollarSign, Building } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await API.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error(error);
                setMessage({ type: 'error', text: 'Failed to load job details.' });
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        if (user.role === 'employer') {
            setMessage({ type: 'error', text: 'Employers cannot apply for jobs.' });
            return;
        }
        if (user.role === 'candidate' && !user.hasResume) {
            navigate('/candidate/dashboard');
            return;
        }

        setApplying(true);
        setMessage(null);
        try {
            await API.post('/applications/apply', { jobId: job._id });
            setMessage({ type: 'success', text: 'Successfully applied!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to apply' });
            if (error.response?.data?.message.includes('resume')) {
                setTimeout(() => navigate('/candidate/dashboard'), 3000);
            }
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
    if (!job) return <div style={{ textAlign: 'center', padding: '4rem' }}>Job not found</div>;

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card">
                <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{job.title}</h2>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-light)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Building size={18} />
                            <span style={{ fontWeight: '500' }}>{job.employerId?.companyName}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <MapPin size={18} />
                            <span>{job.location}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <DollarSign size={18} />
                            <span>{job.salary}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Job Description</h3>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{job.description}</p>
                </div>

                {message && (
                    <div style={{ 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        marginBottom: '1.5rem',
                        background: message.type === 'error' ? 'var(--error)' : 'var(--secondary)',
                        color: 'var(--white)',
                        textAlign: 'center'
                    }}>
                        {message.text}
                    </div>
                )}

                {job.status === 'Open' ? (
                     <button 
                         className="btn btn-primary" 
                         onClick={handleApply} 
                         disabled={applying || (user && user.role === 'employer')}
                         style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                     >
                         {applying ? 'Applying...' : 
                          (user?.role === 'employer' ? 'Employers Cannot Apply' : 
                          (user && !user.hasResume ? 'Upload Resume to Apply' : 'Apply Now'))}
                     </button>
                ) : (
                    <button className="btn" disabled style={{ width: '100%', padding: '1rem', background: 'var(--border)', color: 'var(--text-light)' }}>
                        This job is closed
                    </button>
                )}
               
            </div>
        </div>
    );
};

export default JobDetails;
