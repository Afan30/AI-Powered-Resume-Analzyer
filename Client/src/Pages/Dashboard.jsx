import React, { useEffect, useState } from "react";
import api from "../utils/api";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchResumes();
  }, []);

  const fetchJobs = async () => {
    const res = await api.get("/jobs");
    setJobs(res.data.jobs);
  };

  const fetchResumes = async () => {
    const res = await api.get("/resumes");
    setResumes(res.data.resumes);
  };

  const getMatches = async (jobId) => {
    const res = await api.get(`/jobs/${jobId}/match`);
    setMatches(res.data.matches);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Recruiter Dashboard</h2>

      <div className="dashboard-grid">
        {/* Jobs Section */}
        <div className="dashboard-section">
          <h3>Jobs</h3>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                {job.title}
                <button onClick={() => getMatches(job._id)}>View Matches</button>
              </div>
            ))
          ) : (
            <p>No jobs posted yet</p>
          )}
        </div>

        {/* Matches Section */}
        <div className="dashboard-section">
          <h3>Matched Candidates</h3>
          {matches.length > 0 ? (
            matches.map((match, index) => (
              <div key={index} className="match-card">
                Resume ID: {match.resumeId} | Score: {match.score.toFixed(2)}
              </div>
            ))
          ) : (
            <p>No matches yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
