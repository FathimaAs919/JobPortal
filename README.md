# JobPortal - Full-Stack Recruitment Platform

JobPortal is a comprehensive, modern web application designed bridging the gap between employers and job seekers. Built with the MERN stack (MongoDB, Express, React, Node.js), it provides designated dashboards for both Candidates and Employers, facilitating seamless job applying and applicant tracking workflows.

## Key Features

**For Candidates:**
- 📝 **Dynamic Profiles**: Manage your professional details, skills, education, and social links.
- 📄 **Resume Pipeline**: Upload and manage your resume securely via binary uploads.
- 🔍 **Smart Job Board**: Search and filter active job listings instantly by role, location, and salary.
- 📬 **Application Tracking**: See exactly where your application stands via real-time status UI tags (Applied, Shortlisted, Rejected).

**For Employers:**
- 🏢 **Company Branding**: Build and maintain your company profile with custom descriptions and logos.
- ➕ **Job Management**: Create, edit, and toggle the status of active job listings at any time.
- 👥 **Applicant Review**: Review incoming applications and download candidate resumes directly from your personalized dashboard.

## Technology Stack
- **Frontend**: React.js, Vite, pure responsive CSS (Mobile-First, Glassmorphism aesthetic), Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Security**: JSON Web Tokens (JWT) for stateless authentication and Role-Based Access Control (RBAC), alongside Bcrypt for password hashing.
- **Architecture**: RESTful API design.

## How to Run

1. **Backend Configuration:**
   Navigate into the `/backend` directory:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Configuration:**
   Navigate into the `/frontend` directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
