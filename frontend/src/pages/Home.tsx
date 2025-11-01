import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    navigate("/");
  };

  // --- Handle File Upload (Frontend Only) ---
  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File | null;

    if (file) {
      // Ensure it's a .txt file
      if (!file.name.endsWith(".txt")) {
        alert("Only .txt files are supported.");
        return;
      }

      try {
        const text = await file.text();
        setFileName(file.name);
        setFileContent(text);
        setUploadMessage(`✅ File "${file.name}" uploaded successfully!`);
      } catch (err) {
        console.error("Error reading file:", err);
        alert("Error reading the file.");
      }
    } else {
      // No file chosen: just take context/answer inputs (if you want to process them)
      setFileName(null);
      setFileContent(null);
      setUploadMessage(`✅ No file uploaded — form submitted successfully.`);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Account Settings and Logout Buttons - Top Right */}
        <div className="account-actions">
          <button onClick={() => navigate("/account-settings")}>Account Settings</button>
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        </div>

        <header>
          <h1>Dashboard</h1>
          <p>Welcome to your RAG Evaluator workspace</p>
        </header>

        {/* Upload section */}
        <section>
          <h2>Upload File for Evaluation</h2>
          <form onSubmit={handleUpload}>
            <label>
              Query:
              <textarea
                placeholder="Your query here..."
                name="query"
                rows={2}
                required
              />
            </label>

            <label>
              Context:
              <textarea
                placeholder="Your context here..."
                name="context"
                rows={3}
                required
              />
              <small className="context-hint">(You can optionally attach a .txt file here — it will be read and previewed)</small>
              <input type="file" name="file" accept=".txt" className="context-file-input" />
            </label>

            <label>
              Answer:
              <textarea
                placeholder="Your answer here..."
                name="answer"
                rows={3}
                required
              />
            </label>

            <button type="submit">Upload</button>
          </form>

          {/* --- Confirmation message --- */}
          {uploadMessage && (
            <div className="upload-message" role="status">
              <p>{uploadMessage}</p>
              {fileContent && (
                <details className="file-preview">
                  <summary>📄 View {fileName}</summary>
                  <pre>{fileContent}</pre>
                </details>
              )}
            </div>
          )}
        </section>

        <footer>
          <p>©️ {new Date().getFullYear()} RAG Pipeline Evaluator</p>
        </footer>
      </div>
    </div>
  );
}