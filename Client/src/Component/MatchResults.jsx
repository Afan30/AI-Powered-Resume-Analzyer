import { useState } from "react";
import api from "../utils/api";


const MatchResult = () => {
  const [jobId, setJobId] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobId) return alert("Please enter Job ID");
    setLoading(true);
    try {
      const { data } = await api.post("/match", { jobId });
      console.log(data);
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      alert("Error fetching matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="match-result-container">
      <h2>Find Matches for a Job</h2>
      <div className="match-input-section">
        <input
          type="text"
          placeholder="Enter Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        />
        <button onClick={handleMatch}>
          {loading ? "Matching..." : "Find Matches"}
        </button>
      </div>
      {matches.length > 0 && (
        <table className="match-table">
          <thead>
            <tr>
              <th>Resume ID</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m, i) => (
              <tr key={i}>
                <td>{m.resumeId}</td>
                <td>{(m.score * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MatchResult;
