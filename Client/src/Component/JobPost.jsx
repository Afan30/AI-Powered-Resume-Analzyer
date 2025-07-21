import { useState } from "react";
import api from "../utils/api";


const JobPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/jobs/create", { title, description });
      setMessage("Job posted successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setMessage("Error posting job");
    }
  };

  return (
    <div className="jobpost-container">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit} className="jobpost-form">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="jobpost-btn">
          Post Job
        </button>
      </form>
      {message && <p className="jobpost-message">{message}</p>}
    </div>
  );
};

export default JobPost;
