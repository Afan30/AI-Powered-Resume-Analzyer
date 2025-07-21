import { useState } from "react";
import api from "../utils/api";


const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error uploading resume");
    }
  };

  return (
    <div className="resumeupload-container">
      <h2>Upload Resume</h2>
      <form onSubmit={handleUpload} className="resumeupload-form">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" className="resumeupload-btn">
          Upload
        </button>
      </form>
      {message && <p className="resumeupload-message">{message}</p>}
    </div>
  );
};

export default ResumeUpload;
