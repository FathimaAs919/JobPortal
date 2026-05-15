import { useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import JobCard from '../components/JobCard';
import { Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const JobBoard = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [filterRole, setFilterRole] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterSalary, setFilterSalary] = useState('');

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data } = await API.get(`/jobs?role=${filterRole}&location=${filterLocation}&salary=${filterSalary}`);
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        
        const fetchAppliedJobs = async () => {
            if (user && user.role === 'candidate') {
                try {
                    const { data } = await API.get('/applications/candidate');
                    const ids = data.map(app => app.jobId?._id || app.jobId);
                    setAppliedJobIds(ids);
                } catch (err) {
                    console.error('Error fetching applied jobs', err);
                }
            }
        };
        fetchAppliedJobs();
    }, [user]);

    const displayJobs = jobs.filter(job => !appliedJobIds.includes(job._id));

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '2rem' }}>Explore Opportunities</h2>
            
            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <input 
                            type="text" 
                            placeholder="Job role, e.g. Developer" 
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <input 
                            type="text" 
                            placeholder="Location, e.g. Remote" 
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <input 
                            type="text" 
                            placeholder="Salary, e.g. 100k" 
                            value={filterSalary}
                            onChange={(e) => setFilterSalary(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Search size={18} /> Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading jobs...</div>
            ) : displayJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    No jobs found matching your criteria.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {displayJobs.map(job => (
                        <JobCard key={job._id} job={job} isEmployer={false} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobBoard;
