"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./myfiles.css";

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/files?action=list");
      const data = await res.json();

      if (data.success) {
        setFiles(data.data);
      } else {
        setError(data.message || "Failed to fetch files");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      setDeleting(fileId);
      const res = await fetch(`/api/files?id=${fileId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setFiles(files.filter((f) => f.id !== fileId));
        if (selectedFile?.id === fileId) {
          setSelectedFile(null);
        }
      } else {
        alert(data.message || "Failed to delete file");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  // File list view
  if (!selectedFile) {
    return (
      <div className="myfiles-container">
        <div className="myfiles-header">
          <h1>📁 My Files</h1>
          <Link href="/admin" className="btn back-btn">
            ← Back to Admin
          </Link>
        </div>

        {loading && <div className="loading">Loading files...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && files.length === 0 && (
          <div className="empty-state">
            <p>No files yet. Upload files from the Admin section.</p>
          </div>
        )}

        {!loading && files.length > 0 && (
          <div className="files-grid">
            {files.map((file) => (
              <div
                key={file.id}
                className="file-card"
                onClick={() => setSelectedFile(file)}
              >
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <p className="file-name">{file.originalname}</p>
                  <p className="file-date">
                    {new Date(file.uploadedat).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteFile(file.id, e)}
                  disabled={deleting === file.id}
                  title="Delete file"
                >
                  {deleting === file.id ? "🔄" : "🗑️"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // PDF viewer
  return (
    <div className="myfiles-container pdf-viewer-container">
      <div className="pdf-header">
        <button className="btn back-btn" onClick={() => setSelectedFile(null)}>
          ← Back to Files
        </button>
        <h2>{selectedFile.originalname}</h2>
        <button
          className="delete-btn"
          onClick={(e) =>
            handleDeleteFile(selectedFile.id, e)
          }
          disabled={deleting === selectedFile.id}
        >
          {deleting === selectedFile.id ? "🔄" : "🗑️ Delete"}
        </button>
      </div>

      <div className="pdf-view">
        <iframe
          src={`/uploads/${selectedFile.filename}#toolbar=1&navpanes=0&scrollbar=1`}
          title={selectedFile.originalname}
          className="pdf-iframe"
        />
      </div>

      <div className="pdf-footer">
        <p>
          Viewing: <strong>{selectedFile.originalname}</strong> | Uploaded:{" "}
          {new Date(selectedFile.uploadedat).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
