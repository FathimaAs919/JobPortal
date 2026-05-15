import { Link } from 'react-router-dom';
import { Search, Building2, TrendingUp, ChevronRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-wrapper">
            {/* Corporate Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1>Accelerate Your Career with Industry Leaders</h1>
                        <p>
                            Connect directly with the world's most innovative companies. Discover premium opportunities tailored to your professional expertise and aspirations.
                        </p>
                        <div className="hero-actions">
                            <Link to="/jobs" className="btn btn-primary btn-lg">
                                Find Opportunities <ChevronRight size={18} />
                            </Link>
                            <Link to="/auth" className="btn btn-outline btn-lg">
                                Hire Talent
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="trust-bar">
                 <div className="container">
                     <p>TRUSTED BY INNOVATIVE COMPANIES WORLDWIDE</p>
                     <div className="logos">
                         <div className="logo-placeholder">Acme Corp</div>
                         <div className="logo-placeholder">GlobalTech</div>
                         <div className="logo-placeholder">Nexus Industries</div>
                         <div className="logo-placeholder">Stark LLC</div>
                     </div>
                 </div>
            </section>

            {/* Structured Features Grid */}
            <section className="features-section section-padding">
                <div className="container">
                    <div className="section-title">
                        <h2>Why Professionals Choose Us</h2>
                        <p>A streamlined, efficient platform designed for serious career advancement.</p>
                    </div>
                    
                    <div className="grid features-grid">
                        <div className="feature-card">
                            <Search size={32} strokeWidth={1.5} className="feature-icon" />
                            <h3>Precision Matching</h3>
                            <p>Our algorithms ensure your profile is surfaced for roles that perfectly match your skills and salary expectations.</p>
                        </div>
                        <div className="feature-card">
                            <Building2 size={32} strokeWidth={1.5} className="feature-icon" />
                            <h3>Direct Employer Access</h3>
                            <p>Bypass third-party recruiters and engage directly with internal hiring teams at top-tier organizations.</p>
                        </div>
                        <div className="feature-card">
                            <TrendingUp size={32} strokeWidth={1.5} className="feature-icon" />
                            <h3>Market Intelligence</h3>
                            <p>Leverage our proprietary salary insights and market trends to make informed career decisions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate CTA */}
            <section className="cta-section">
                <div className="container cta-container">
                    <h2>Ready to take the next step?</h2>
                    <p>Join thousands of professionals securing their future today.</p>
                    <Link to="/auth" className="btn btn-primary btn-lg">
                        Create Your Free Profile
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
