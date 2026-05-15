import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { UploadCloud, Briefcase, GraduationCap, MapPin, Mail, Phone, FileText, CheckCircle, Clock, Search, Edit } from 'lucide-react';

const CandidateDashboard = () => {
    const { user, login } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name, email: user?.email, phone: user?.phone || '', location: user?.location || '', currentRole: user?.currentRole || '',
        experience: user?.experience || '', preferredJobRole: user?.preferredJobRole || '', skills: user?.skills?.join(', ') || '',
        education: { collegeName: user?.education?.collegeName || '', degree: user?.education?.degree || '', specialization: user?.education?.specialization || '', graduationYear: user?.education?.graduationYear || '' },
        socialLinks: { linkedin: user?.socialLinks?.linkedin || '', github: user?.socialLinks?.github || '' }
    });
    const [profileMsg, setProfileMsg] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await API.get('/applications/candidate');
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchApplications();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        try {
            setUploadStatus('Uploading...');
            const { data } = await API.post('/auth/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus('Upload successful!');

            if (user) {
                login({ ...user, hasResume: true });
            }
            setFile(null);
            setTimeout(() => setUploadStatus(''), 3000);
        } catch (error) {
            setUploadStatus('Upload failed: ' + (error.response?.data?.message || 'error'));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMsg(null);
        try {
            const { data } = await API.put('/auth/profile', profileData);
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
            login(data);
            setTimeout(() => { setIsEditing(false); setProfileMsg(null); }, 2000);
        } catch (err) {
            setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        }
    }

    if (isEditing) {
        return (
            <div className="container section-padding" style={{ padding: '3rem 1.5rem', minHeight: '80vh', background: 'var(--bg-secondary)' }}>
                <div className="feature-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Edit size={24} /> Edit Your Profile
                        </h3>
                        <button className="btn btn-outline" style={{ color: 'var(--text-body)', borderColor: 'var(--border)' }} onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>

                    {profileMsg && (
                        <div style={{ padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: `1px solid ${profileMsg.type === 'error' ? '#FFA8A8' : '#20C997'}`, background: profileMsg.type === 'error' ? '#FFF5F5' : '#E6FCF5', color: profileMsg.type === 'error' ? '#E03131' : '#0CA678', fontWeight: '500' }}>
                            {profileMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Basic Details</h4>
                            <div className="grid-2-col">
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Name</label><input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required /></div>
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Email</label><input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} required /></div>
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Phone</label><input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} /></div>
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Location</label><input type="text" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} /></div>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Professional</h4>
                            <div className="grid-2-col">
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Current Role</label><input type="text" value={profileData.currentRole} onChange={e => setProfileData({...profileData, currentRole: e.target.value})} /></div>
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Preferred Role</label><input type="text" value={profileData.preferredJobRole} onChange={e => setProfileData({...profileData, preferredJobRole: e.target.value})} /></div>
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Experience (e.g. 2+ Yrs)</label><input type="text" value={profileData.experience} onChange={e => setProfileData({...profileData, experience: e.target.value})} /></div>
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Skills (comma separated)</label><input type="text" value={profileData.skills} onChange={e => setProfileData({...profileData, skills: e.target.value})} /></div>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Education</h4>
                            <div className="grid-2-col">
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Degree</label><input type="text" value={profileData.education.degree} onChange={e => setProfileData({...profileData, education: {...profileData.education, degree: e.target.value}})} /></div>
                                <div><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Specialization</label><input type="text" value={profileData.education.specialization} onChange={e => setProfileData({...profileData, education: {...profileData.education, specialization: e.target.value}})} /></div>
                                <div style={{ gridColumn: 'span 2' }}><label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>College Name</label><input type="text" value={profileData.education.collegeName} onChange={e => setProfileData({...profileData, education: {...profileData.education, collegeName: e.target.value}})} /></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.875rem 2.5rem' }}>Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container section-padding" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2.25rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Candidate Dashboard</h2>
                <p style={{ color: 'var(--text-muted)' }}>Manage your profile, update your resume, and track active job applications.</p>
            </div>

            <div className="dashboard-grid">
                
                {/* Left Column - Profile & Resume */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Profile Card */}
                    <div className="feature-card" style={{ padding: '2rem 1.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user?.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{user?.currentRole || 'Candidate'}</p>
                            
                            <button className="btn btn-outline" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', width: '100%', fontSize: '0.875rem', padding: '0.5rem' }} onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                                <Mail size={16} color="var(--text-muted)" />
                                <span style={{ wordBreak: 'break-all' }}>{user?.email}</span>
                            </div>
                            {user?.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                                    <Phone size={16} color="var(--text-muted)" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            {user?.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                                    <MapPin size={16} color="var(--text-muted)" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume Upload Card */}
                    <div className="feature-card" style={{ padding: '2rem 1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                            <FileText size={18} /> Manage Resume
                        </h4>
                        
                        {user?.hasResume && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.75rem', background: '#E6FCF5', border: '1px solid #20C997', borderRadius: '4px', color: '#0CA678', fontSize: '0.9rem', fontWeight: '500' }}>
                                <CheckCircle size={16} /> Active resume on file
                            </div>
                        )}

                        <form onSubmit={handleUpload}>
                            <div style={{ border: '2px dashed var(--border)', borderRadius: '4px', padding: '1.5rem 1rem', textAlign: 'center', marginBottom: '1rem', background: 'var(--bg-secondary)', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                                <UploadCloud size={24} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-body)', cursor: 'pointer' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Click to select</span> or drag PDF here
                                    <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                                {file && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500' }}>Selected: {file.name}</p>}
                            </div>
                            
                            <button type="submit" className="btn btn-primary" disabled={!file} style={{ width: '100%' }}>
                                Upload New Resume
                            </button>
                        </form>
                        {uploadStatus && (
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', textAlign: 'center', color: uploadStatus.includes('failed') ? 'var(--error)' : 'var(--primary)', fontWeight: '500' }}>
                                {uploadStatus}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column - Details & Applications */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Professional & Education Details (Only if data exists) */}
                    {(user?.currentRole || user?.education?.collegeName) && (
                        <div className="feature-card dashboard-half-grid" style={{ padding: '2rem' }}>
                            {user?.currentRole && (
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
                                        <Briefcase size={18} /> Professional Info
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Role</span>
                                            <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{user.currentRole} {user.experience && `• ${user.experience}`}</span>
                                        </div>
                                        {user?.preferredJobRole && (
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preferred Role</span>
                                                <span style={{ color: 'var(--text-body)' }}>{user.preferredJobRole}</span>
                                            </div>
                                        )}
                                        {user?.skills?.length > 0 && (
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Core Skills</span>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {user.skills.map((skill, i) => (
                                                        <span key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-body)' }}>{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {user?.education?.collegeName && (
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
                                        <GraduationCap size={18} /> Education
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Degree</span>
                                            <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{user.education.degree} {user.education.specialization && `in ${user.education.specialization}`}</span>
                                        </div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Institution</span>
                                            <span style={{ color: 'var(--text-body)' }}>{user.education.collegeName}</span>
                                        </div>
                                        {user.education.graduationYear && (
                                            <div>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Graduation Year</span>
                                                <span style={{ color: 'var(--text-body)' }}>{user.education.graduationYear}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Applications List */}
                    <div className="feature-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-dark)' }}>My Applications</h3>
                            <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                                {applications.length} Total
                            </span>
                        </div>
                        
                        {applications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px dashed var(--border)' }}>
                                <Search size={40} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>You haven't submitted any applications yet.</p>
                                <a href="/jobs" style={{ color: 'var(--primary)', fontWeight: '500' }}>Browse open roles to get started.</a>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {applications.map(app => (
                                    <div key={app._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '4px', transition: 'border-color 0.2s', background: 'white' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-dark)' }}>{app.jobId?.title}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Briefcase size={14} /> {app.jobId?.employerId?.companyName || 'Unknown Company'}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <span style={{
                                                background: app.status === 'Applied' ? '#EBF4FF' : app.status === 'Shortlisted' ? '#E6FCF5' : '#FFF5F5',
                                                border: `1px solid ${app.status === 'Applied' ? '#A3BFFA' : app.status === 'Shortlisted' ? '#20C997' : '#FFA8A8'}`,
                                                color: app.status === 'Applied' ? '#0052CC' : app.status === 'Shortlisted' ? '#0CA678' : '#E03131',
                                                padding: '0.35rem 0.85rem', 
                                                borderRadius: '99px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
