import React from "react";


const Navbar =() => {
  return (
    <nav className="navbar">
      <div 
       className="navbar-logo">AI Resume Matcher
       </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/resumes">Upload Resume</a></li>
        <li><a href="/optimize">Optimize Resume</a></li>
        <li><a href="/match">Match Results</a></li>
        <li><a href="/jobs">Post Job</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
