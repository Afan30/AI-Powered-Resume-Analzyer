import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Home from "./Pages/Home";
import ResumeUpload from "./Component/ResumeUpload";
import JobPost from "./Component/JobPost";
import Dashboard from "./Pages/Dashboard";
import MatchResult from "./Component/MatchResults";
import OptimizeResume from "./Component/OptimizeResume";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resumes" element={<ResumeUpload />} />
        <Route path="/jobs" element={<JobPost />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/match" element={<MatchResult />} />
        <Route path="/optimize" element={<OptimizeResume />} />
      </Routes>
    </Router>
  );
}

export default App;
