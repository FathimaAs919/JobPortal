import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'candidate',
        companyName: '', companyLogo: '', companyWebsite: '', companyDescription: '', industryType: '',
        phone: '', profilePicture: '', location: '', skills: '', experience: '', currentRole: '', preferredJobRole: '',
        collegeName: '', degree: '', specialization: '', graduationYear: '', linkedin: '', github: ''
    });
    const [error, setError] = useState(null);
    const [picFile, setPicFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                const { data } = await API.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
                login(data);
                navigate(data.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
            } else {
                const payload = {
                    ...formData,
                    skills: formData.role === 'candidate' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                    education: formData.role === 'candidate' ? {
                        collegeName: formData.collegeName, degree: formData.degree, specialization: formData.specialization, graduationYear: formData.graduationYear
                    } : undefined,
                    socialLinks: formData.role === 'candidate' ? {
                        linkedin: formData.linkedin, github: formData.github
                    } : undefined
                };
                const { data } = await API.post('/auth/register', payload);

                // If they selected a profile picture, upload it immediately using the new token
                if (data.role === 'candidate' && picFile) {
                    const picData = new FormData();
                    picData.append('profilePicture', picFile);
                    try {
                        await API.post('/auth/upload-profile-picture', picData, {
                            headers: { 
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${data.token}`
                            }
                        });
                        data.hasProfilePicture = true;
                    } catch (picErr) {
                        console.error('Failed to upload profile picture during registration', picErr);
                    }
                }

                login(data);
                navigate(data.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
            }
        } catch (err) {
            let errorMsg = err.response?.data?.message || 'Authentication failed';
            if (isLogin && errorMsg === 'Invalid email or password') {
                errorMsg = 'Invalid email or password. Please check your credentials or Register for a new account below.';
            }
            setError(errorMsg);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="glass-card fade-in">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h2>

                {error && <div style={{ background: '#DE350B', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500', lineHeight: '1.4' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" required onChange={handleChange} />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required onChange={handleChange} />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="candidate">Candidate</option>
                                <option value="employer">Employer</option>
                            </select>
                        </div>
                    )}

                    {!isLogin && formData.role === 'employer' && (
                        <>
                            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Company Details</h4>
                            <div className="form-group"><label>Company Name</label><input type="text" name="companyName" required onChange={handleChange} /></div>
                            <div className="form-group"><label>Company Logo URL</label><input type="url" name="companyLogo" required onChange={handleChange} /></div>
                            <div className="form-group"><label>Website URL</label><input type="url" name="companyWebsite" required onChange={handleChange} /></div>
                            <div className="form-group"><label>Industry Type</label><input type="text" name="industryType" required onChange={handleChange} /></div>
                            <div className="form-group"><label>Description</label><textarea name="companyDescription" rows="3" required onChange={handleChange}></textarea></div>
                        </>
                    )}

                    {!isLogin && formData.role === 'candidate' && (
                        <>
                            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Candidate Details</h4>
                            <div className="grid-2-col">
                                <div className="form-group"><label>Phone</label><input type="tel" name="phone" required onChange={handleChange} /></div>
                                <div className="form-group"><label>Location</label><input type="text" name="location" required onChange={handleChange} /></div>
                            </div>
                            
                            <div className="form-group">
                                <label>Profile Picture</label>
                                <input type="file" accept="image/jpeg, image/png" required onChange={(e) => setPicFile(e.target.files[0])} style={{ padding: '0.5rem', fontSize: '0.875rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px solid var(--border)', width: '100%', color: 'var(--text-color)' }} />
                            </div>

                            <h5 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Professional</h5>
                            <div className="form-group"><label>Skills (comma separated)</label><input type="text" name="skills" required placeholder="e.g. React, Node, CSS" onChange={handleChange} /></div>
                            <div className="grid-2-col">
                                <div className="form-group"><label>Experience</label><input type="text" name="experience" required placeholder="e.g. 2 Years" onChange={handleChange} /></div>
                                <div className="form-group"><label>Current Role</label><input type="text" name="currentRole" required onChange={handleChange} /></div>
                            </div>
                            <div className="form-group"><label>Preferred Job Role</label><input type="text" name="preferredJobRole" required onChange={handleChange} /></div>

                            <h5 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Education</h5>
                            <div className="form-group"><label>College Name</label><input type="text" name="collegeName" required onChange={handleChange} /></div>
                            <div className="grid-2-col">
                                <div className="form-group"><label>Degree</label><input type="text" name="degree" required onChange={handleChange} /></div>
                                <div className="form-group"><label>Specialization</label><input type="text" name="specialization" required onChange={handleChange} /></div>
                            </div>
                            <div className="form-group"><label>Graduation Year</label><input type="number" name="graduationYear" required onChange={handleChange} /></div>

                            <h5 style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Social Links</h5>
                            <div className="grid-2-col">
                                <div className="form-group"><label>LinkedIn</label><input type="url" name="linkedin" required onChange={handleChange} /></div>
                                <div className="form-group"><label>GitHub</label><input type="url" name="github" required onChange={handleChange} /></div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-light)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
