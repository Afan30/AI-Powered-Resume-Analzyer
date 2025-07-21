import { useState } from "react";
import api from "../utils/api";


const OptimizeResume = () => {
  const [resumeId, setResumeId] = useState("");
  const [jobId, setJobId] = useState("");
  const [optimizedText, setOptimizedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    if (!resumeId || !jobId) return alert("Both Resume ID and Job ID are required");
    setLoading(true);
    try {
      const { data } = await api.post("/resumes/optimize", { resumeId, jobId });
      setOptimizedText(data.optimizedText || "No optimized text returned");
    } catch (err) {
      console.error(err);
      alert("Error optimizing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="optimize-container">
      <h2>Optimize Resume</h2>
      <div className="optimize-form">
        <input
          type="text"
          placeholder="Enter Resume ID"
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        />
        <button onClick={handleOptimize}>
          {loading ? "Optimizing..." : "Optimize Resume"}
        </button>
      </div>
      {optimizedText && (
        <div className="optimize-output">
          <h3>Optimized Resume:</h3>
          <pre>{optimizedText}</pre>
        </div>
      )}
    </div>
  );
};

export default OptimizeResume;
