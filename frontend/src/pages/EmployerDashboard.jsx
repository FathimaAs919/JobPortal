import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { Briefcase, Users, PlusCircle, Building, MapPin, DollarSign, Clock, CheckCircle, Edit, Globe, Tag } from 'lucide-react';

const EmployerDashboard = () => {
    const { user, login } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'jobs' | 'post' | 'applicants' | 'edit-job'
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [editJobId, setEditJobId] = useState(null);

    // Job Form state
    const [formData, setFormData] = useState({ title: '', role: '', location: '', salary: '', description: '', experience: '', skillsRequired: '', jobType: 'Full-Time', vacancies: '' });
    // Profile Form state
    const [profileData, setProfileData] = useState({ name: user?.name, email: user?.email, companyName: user?.companyName, companyLogo: user?.companyLogo || '', companyWebsite: user?.companyWebsite || '', companyDescription: user?.companyDescription || '', industryType: user?.industryType || '' });
    
    // Search & Filter state for Active Listings
    const [jobStatusFilter, setJobStatusFilter] = useState('All');

    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await API.get('/jobs/employer');
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchApplicants = async (jobId) => {
        try {
            const { data } = await API.get(`/applications/job/${jobId}`);
            setApplicants(data);
            setActiveTab('applicants');
            setSelectedJob(jobs.find(j => j._id === jobId));
        } catch (error) {
            console.error('Error fetching applicants:', error);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            await API.post('/jobs', {
                ...formData,
                companyName: user.companyName,
                companyLogo: user.companyLogo,
                skillsRequired: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()) : []
            });
            setMessage({ type: 'success', text: 'Job posted successfully!' });
            setFormData({ title: '', role: '', location: '', salary: '', description: '', experience: '', skillsRequired: '', jobType: 'Full-Time', vacancies: '' });
            fetchJobs();
            setTimeout(() => { setActiveTab('jobs'); setMessage(null); }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to post job' });
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const { data } = await API.put('/auth/profile', profileData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            login(data); // update global context
            setTimeout(() => { setMessage(null); }, 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        }
    };

    const handleUpdateStatus = async (appId, status) => {
        try {
            await API.put(`/applications/${appId}/status`, { status });
            fetchApplicants(selectedJob._id);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleToggleJobStatus = async (jobId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
            await API.put(`/jobs/${jobId}`, { status: newStatus });
            fetchJobs();
        } catch (error) {
            console.error('Error toggling job status:', error);
        }
    };

    const handleEditClick = (job) => {
        setEditJobId(job._id);
        setFormData({
            title: job.title, role: job.role, location: job.location, salary: job.salary, description: job.description,
            experience: job.experience || '', skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : '',
            jobType: job.jobType || 'Full-Time', vacancies: job.vacancies || ''
        });
        setMessage(null);
        setActiveTab('edit-job');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            await API.put(`/jobs/${editJobId}`, {
                ...formData,
                skillsRequired: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()) : []
            });
            setMessage({ type: 'success', text: 'Job updated successfully!' });
            setFormData({ title: '', role: '', location: '', salary: '', description: '', experience: '', skillsRequired: '', jobType: 'Full-Time', vacancies: '' });
            setEditJobId(null);
            fetchJobs();
            setTimeout(() => { setActiveTab('jobs'); setMessage(null); }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update job' });
        }
    };

    const filteredJobs = jobs.filter(job => {
        return jobStatusFilter === 'All' || job.status === jobStatusFilter;
    });

    return (
        <div className="container section-padding" style={{ padding: '3rem 1.5rem', minHeight: '80vh', background: 'var(--bg-secondary)' }}>
            
            {/* Header Section */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    {user?.companyLogo ? <img src={user.companyLogo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }} /> : <Building size={32} />}
                </div>
                <div>
                    <h2 style={{ fontSize: '2.25rem', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{user?.companyName}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Employer Dashboard & Recruitment Center</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
                <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`} style={activeTab !== 'profile' ? { color: 'var(--text-dark)', borderColor: 'var(--border)', background: 'white' } : {}} onClick={() => { setActiveTab('profile'); setMessage(null); }}>
                    <Building size={18} /> Company Profile
                </button>
                <button className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-outline'}`} style={activeTab !== 'jobs' ? { color: 'var(--text-dark)', borderColor: 'var(--border)', background: 'white' } : {}} onClick={() => { setActiveTab('jobs'); setMessage(null); }}>
                    <Briefcase size={18} /> Active Listings
                </button>
                <button className={`btn ${activeTab === 'post' ? 'btn-primary' : 'btn-outline'}`} style={activeTab !== 'post' ? { color: 'var(--text-dark)', borderColor: 'var(--border)', background: 'white' } : {}} onClick={() => { setFormData({ title: '', role: '', location: '', salary: '', description: '', experience: '', skillsRequired: '', jobType: 'Full-Time', vacancies: '' }); setActiveTab('post'); setMessage(null); }}>
                    <PlusCircle size={18} /> Post New Job
                </button>
                
                {activeTab === 'edit-job' && (
                    <button className="btn btn-primary"><CheckCircle size={18} /> Editing Listing</button>
                )}
                {activeTab === 'applicants' && (
                    <button className="btn btn-primary"><Users size={18} /> Reviewing Applicants</button>
                )}
            </div>

            {/* Tab Contents */}
            <div>
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="dashboard-grid">
                        
                        {/* Company Details View */}
                        <div className="feature-card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Building size={20} /> Company Profile
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div><span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Administrator Name</span><span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{user?.name}</span></div>
                                <div><span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</span><span style={{ color: 'var(--text-body)' }}>{user?.email}</span></div>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                                <div><span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Company Name</span><span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{user?.companyName}</span></div>
                                {user?.industryType && <div><span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Industry</span><span style={{ color: 'var(--text-body)' }}>{user?.industryType}</span></div>}
                                {user?.companyWebsite && <div><span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Website</span><a href={user.companyWebsite} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{user.companyWebsite}</a></div>}
                                {user?.companyDescription && (
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>About</span>
                                        <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', lineHeight: '1.5' }}>{user.companyDescription}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        <div className="feature-card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Edit size={20} /> Edit Details
                            </h3>
                            {message && (
                                <div style={{ padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', border: `1px solid ${message.type === 'error' ? '#FFA8A8' : '#20C997'}`, background: message.type === 'error' ? '#FFF5F5' : '#E6FCF5', color: message.type === 'error' ? '#E03131' : '#0CA678', fontSize: '0.9rem', fontWeight: '500' }}>
                                    {message.text}
                                </div>
                            )}
                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Admin Name</label>
                                        <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Admin Email</label>
                                        <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                                    </div>
                                </div>
                                <div className="grid-2-col">
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Company Name</label>
                                        <input type="text" value={profileData.companyName} onChange={e => setProfileData({...profileData, companyName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Industry Type</label>
                                        <input type="text" value={profileData.industryType} onChange={e => setProfileData({...profileData, industryType: e.target.value})} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Website URL</label>
                                    <input type="url" value={profileData.companyWebsite} onChange={e => setProfileData({...profileData, companyWebsite: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Logo URL</label>
                                    <input type="url" value={profileData.companyLogo} onChange={e => setProfileData({...profileData, companyLogo: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>Company Description</label>
                                    <textarea rows="4" value={profileData.companyDescription} onChange={e => setProfileData({...profileData, companyDescription: e.target.value})}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Changes</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Active Listings Tab */}
                {activeTab === 'jobs' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                        
                        {jobs.length > 0 && (
                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <select 
                                    value={jobStatusFilter} 
                                    onChange={(e) => setJobStatusFilter(e.target.value)}
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)', width: '100%', cursor: 'pointer' }}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                        )}

                        {filteredJobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0', background: 'white', borderRadius: '4px', border: '1px dashed var(--border)' }}>
                                <Briefcase size={40} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>{jobs.length === 0 ? 'Your company has no active job listings.' : 'No job listings match your search.'}</p>
                                {jobs.length === 0 && <button className="btn btn-primary" onClick={() => setActiveTab('post')}>Post your first job</button>}
                            </div>
                        ) : (
                            filteredJobs.map(job => (
                                <div key={job._id} className="feature-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)' }}>{job.title}</h3>
                                            <span style={{
                                                background: job.status === 'Open' ? '#E6FCF5' : '#FFF5F5',
                                                border: `1px solid ${job.status === 'Open' ? '#20C997' : '#FFA8A8'}`,
                                                color: job.status === 'Open' ? '#0CA678' : '#E03131',
                                                padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase'
                                            }}>
                                                {job.status}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={16} /> {job.location}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><DollarSign size={16} /> {job.salary}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={16} /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button className="btn btn-outline" style={{ color: 'var(--text-body)', borderColor: 'var(--border)' }} onClick={() => handleEditClick(job)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-outline" style={{ color: job.status === 'Open' ? '#E03131' : '#0CA678', borderColor: 'var(--border)' }} onClick={() => handleToggleJobStatus(job._id, job.status)}>
                                            {job.status === 'Open' ? 'Close Job' : 'Reopen Job'}
                                        </button>
                                        <button className="btn btn-primary" onClick={() => fetchApplicants(job._id)}>
                                            Review Applicants
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Post/Edit Job Form Tab */}
                {(activeTab === 'post' || activeTab === 'edit-job') && (
                    <div className="feature-card" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--text-dark)' }}>
                            {activeTab === 'post' ? 'Create a New Job Listing' : 'Update Job Listing'}
                        </h3>
                        
                        {message && (
                            <div style={{ padding: '1rem', borderRadius: '4px', marginBottom: '2rem', border: `1px solid ${message.type === 'error' ? '#FFA8A8' : '#20C997'}`, background: message.type === 'error' ? '#FFF5F5' : '#E6FCF5', color: message.type === 'error' ? '#E03131' : '#0CA678', fontWeight: '500' }}>
                                {message.text}
                            </div>
                        )}
                        
                        <form onSubmit={activeTab === 'post' ? handlePostJob : handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Job Title</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Role/Department</label>
                                    <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                                </div>
                            </div>
                            
                            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Location</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Salary Range</label>
                                    <input type="text" placeholder="e.g. $80k - $100k" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} required />
                                </div>
                            </div>
                            
                            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Job Type</label>
                                    <select value={formData.jobType} onChange={e => setFormData({ ...formData, jobType: e.target.value })}>
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Positions Available</label>
                                    <input type="number" min="1" value={formData.vacancies} onChange={e => setFormData({ ...formData, vacancies: e.target.value })} required />
                                </div>
                            </div>
                            
                            <div className="grid-2-col" style={{ gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Experience Required</label>
                                    <input type="text" placeholder="e.g. 3+ Years" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Required Skills (comma separated)</label>
                                    <input type="text" placeholder="e.g. React, Node.js" value={formData.skillsRequired} onChange={e => setFormData({ ...formData, skillsRequired: e.target.value })} required />
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Full Job Description</label>
                                <textarea rows="8" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required style={{ resize: 'vertical' }}></textarea>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2.5rem' }}>
                                    {activeTab === 'post' ? 'Publish Job Listing' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Applicants Tab */}
                {activeTab === 'applicants' && (
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>
                                Applicants for <span style={{ color: 'var(--primary)' }}>{selectedJob?.title}</span>
                            </h3>
                            <button className="btn btn-outline" style={{ color: 'var(--text-body)', borderColor: 'var(--border)', background: 'white' }} onClick={() => setActiveTab('jobs')}>
                                Back to Jobs
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {applicants.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem 0', background: 'white', borderRadius: '4px', border: '1px dashed var(--border)' }}>
                                    <Users size={40} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No candidates have applied to this position yet.</p>
                                </div>
                            ) : (
                                applicants.map(app => (
                                    <div key={app._id} className="feature-card" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>{app.candidateId.name}</h4>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                <Globe size={14} /> {app.candidateId.email}
                                            </p>
                                            
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <a href={`http://localhost:5000/api/auth/resume/${app.candidateId._id}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                                    View Resume PDF
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                                                <span style={{
                                                    background: app.status === 'Applied' ? '#EBF4FF' : app.status === 'Shortlisted' ? '#E6FCF5' : '#FFF5F5',
                                                    border: `1px solid ${app.status === 'Applied' ? '#A3BFFA' : app.status === 'Shortlisted' ? '#20C997' : '#FFA8A8'}`,
                                                    color: app.status === 'Applied' ? '#0052CC' : app.status === 'Shortlisted' ? '#0CA678' : '#E03131',
                                                    padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase'
                                                }}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Action:</span>
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                                    style={{ width: 'auto', padding: '0.35rem 2rem 0.35rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer' }}
                                                >
                                                    <option value="Applied">Mark Applied</option>
                                                    <option value="Shortlisted">Shortlist Candidate</option>
                                                    <option value="Rejected">Reject Candidate</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;
