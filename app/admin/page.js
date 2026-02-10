"use client";
import React, { useState, useEffect } from "react";
import "./admin.css";
import { createQuestion, createBulkQuestions } from "../../services/question.service"

const SKILLS_DATA = {
  JavaScript: ["Closure", "Functions", "Arrays", "Promises"],
  React: ["Hooks", "State", "Props"],
  CSS: ["Flexbox", "Grid"],
};

export default function AddQuestion() {
  const [section, setSection] = useState("dashboard");
  // dashboard | home | questions | single | bulk | simple | users | addUser

  /* ---------------- COMMON FORM STATE ---------------- */
  const [form, setForm] = useState({
    skill: "",
    concept: "",
    title: "",
    code: "",
    explanation: "",
  });

  const [jsonText, setJsonText] = useState("");

  // User management state
  const [authUsers, setAuthUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [messageUsers, setMessageUsers] = useState("");

  const concepts = form.skill ? SKILLS_DATA[form.skill] : [];

  const resetForm = () =>
    setForm({
      skill: "",
      concept: "",
      title: "",
      code: "",
      explanation: "",
    });

  const resetUserForm = () =>
    setUserForm({
      username: "",
      email: "",
      password: "",
      role: "user",
    });

  // Fetch auth users
  const fetchAuthUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/auth/manage-users");
      const data = await res.json();
      setAuthUsers(data?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load users when users section is opened
  useEffect(() => {
    if (section === "users") {
      fetchAuthUsers();
    }
  }, [section]);

  /* ---------------- SINGLE QUESTION ---------------- */
  const handleSingleSave = async () => {
    const { skill, concept, title, code, explanation, } = form;
    if (!skill || !concept || !title || !code || !explanation) {
      alert("All fields are mandatory");
      return;
    }

    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Question saved");
    resetForm();
    setSection("questions");
  };

  /* ---------------- BULK QUESTIONS ---------------- */
  const handleBulkSave = async () => {
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) {
        alert("JSON must be an array");
        return;
      }
      await createBulkQuestions(data);
      resetForm();
      setJsonText("");
      setSection("questions");
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  /* ---------------- SIMPLE QUESTION + ANSWER ---------------- */
  const handleSimpleSave = async () => {
    const { skill, concept, title, explanation, } = form;
    try {
      await createQuestion({
        skill,
        concept,
        title,
        explanation,
        issinglequestionanswer: true,
      });
      resetForm();
      setSection("questions");
    } finally {

    }
  };

  /* ================= USER MANAGEMENT ================= */
  const handleAddUser = async () => {
    if (!userForm.username || !userForm.email || !userForm.password) {
      setMessageUsers("All fields are required");
      return;
    }

    setLoadingUsers(true);
    setMessageUsers("");

    try {
      const res = await fetch("/api/auth/manage-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageUsers(data.message || "Failed to add user");
      } else {
        setMessageUsers("User added successfully!");
        resetUserForm();
        await fetchAuthUsers();
        setSection("users");
      }
    } catch (err) {
      setMessageUsers("Error adding user");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch("/api/auth/manage-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      if (res.ok) {
        await fetchAuthUsers();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await fetch("/api/auth/manage-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (res.ok) {
        await fetchAuthUsers();
      }
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="form-container">

      {/* ================= DASHBOARD ================= */}
      {section === "dashboard" && (
        <>
          <h2 className="form-title">Admin Dashboard</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card" onClick={() => setSection("users")}>
              <div className="card-icon">👥</div>
              <h3>User Management</h3>
              <p>Add, edit, and manage users</p>
            </div>
            <div className="dashboard-card" onClick={() => setSection("questions")}>
              <div className="card-icon">📚</div>
              <h3>Questions</h3>
              <p>Manage interview questions</p>
            </div>
            <div className="dashboard-card" style={{ opacity: 0.5, cursor: "not-allowed" }}>
              <div className="card-icon">🔐</div>
              <h3>Roles</h3>
              <p>Coming soon...</p>
            </div>
          </div>
        </>
      )}

      {/* ================= HOME ================= */}
      {section === "home" && (
        <>
          <h2 className="form-title">Admin Panel</h2>
          <button className="btn" onClick={() => setSection("questions")}>Questions</button>
          <button className="btn" onClick={() => setSection("users")}>Users</button>
          <button className="btn" disabled>Roles</button>

        </>
      )}

      {/* ================= QUESTIONS MENU ================= */}
      {section === "questions" && (
        <>
          <h2 className="form-title">Questions</h2>
          <button className="btn" onClick={() => setSection("single")}>➕ Add Single Question</button>
          <button className="btn" onClick={() => setSection("bulk")}>⬆ Add Bulk Questions</button>
          <button className="btn" onClick={() => setSection("simple")}>✍ Add Simple Q&A</button>
          <button className="btn cancel-btn" onClick={() => setSection("dashboard")}>← Back</button>
        </>
      )}

      {/* ================= SINGLE FORM ================= */}
      {section === "single" && (
        <>
          <h2 className="form-title">Add Single Question</h2>

          <select className="input" value={form.skill}
            onChange={(e) => setForm({ ...form, skill: e.target.value, concept: "" })}>
            <option value="">Select Skill</option>
            {Object.keys(SKILLS_DATA).map(s => <option key={s}>{s}</option>)}
          </select>

          <select className="input" value={form.concept}
            disabled={!form.skill}
            onChange={(e) => setForm({ ...form, concept: e.target.value })}>
            <option value="">Select Concept</option>
            {concepts.map(c => <option key={c}>{c}</option>)}
          </select>

          <input className="input" placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <textarea className="textarea code-area" placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })} />

          <textarea className="textarea" placeholder="Explanation"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })} />

          <div className="button-row">
            <button className="btn add-btn" onClick={handleSingleSave}>Save</button>
            <button className="btn cancel-btn" onClick={() => setSection("questions")}>← Back</button>
          </div>
        </>
      )}

      {/* ================= BULK ================= */}
      {section === "bulk" && (
        <>
          <h2 className="form-title">Bulk Questions Upload</h2>
          <textarea className="textarea" value={jsonText}
            onChange={(e) => setJsonText(e.target.value)} />
          <div className="button-row">
            <button className="btn add-btn" onClick={handleBulkSave}>Save Questions</button>
            <button className="btn cancel-btn" onClick={() => setSection("questions")}>← Back</button>
          </div>
        </>
      )}

      {/* ================= SIMPLE Q&A ================= */}
      {section === "simple" && (
        <>
          <h2 className="form-title">Add Simple Question & Answer</h2>

          <select className="input" value={form.skill}
            onChange={(e) => setForm({ ...form, skill: e.target.value, concept: "" })}>
            <option value="">Select Skill</option>
            {Object.keys(SKILLS_DATA).map(s => <option key={s}>{s}</option>)}
          </select>

          <select className="input" value={form.concept}
            disabled={!form.skill}
            onChange={(e) => setForm({ ...form, concept: e.target.value })}>
            <option value="">Select Concept</option>
            {concepts.map(c => <option key={c}>{c}</option>)}
          </select>

          <input className="input" placeholder="Question Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <textarea className="textarea" placeholder="Answer"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })} />

          <div className="button-row">
            <button className="btn add-btn" onClick={handleSimpleSave}>Save</button>
            <button className="btn cancel-btn" onClick={() => setSection("questions")}>← Back</button>
          </div>
        </>
      )}

      {/* ================= USERS MENU ================= */}
      {section === "users" && (
        <>
          <h2 className="form-title">User Management</h2>
          <button className="btn add-btn" onClick={() => setSection("addUser")}>➕ Add User</button>

          <div className="users-section">
            <h3>Current Users</h3>
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : authUsers.length === 0 ? (
              <p>No users found</p>
            ) : (
              <>
                {/* DESKTOP TABLE VIEW */}
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <select
                            value={user.role || "user"}
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                            className="role-select"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn cancel-btn"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* MOBILE CARD VIEW */}
                <div className="users-card-view">
                  {authUsers.map((user) => (
                    <div key={user.id} className="user-card">
                      <div className="user-card-header">
                        <div className="user-card-title">
                          <strong>{user.username}</strong>
                          <span className="user-id">ID: {user.id}</span>
                        </div>
                      </div>
                      <div className="user-card-body">
                        <div className="user-card-row">
                          <label>Email:</label>
                          <span>{user.email}</span>
                        </div>
                        <div className="user-card-row">
                          <label>Role:</label>
                          <select
                            value={user.role || "user"}
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                            className="role-select-mobile"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="user-card-row">
                          <label>Created:</label>
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="user-card-footer">
                        <button
                          className="btn cancel-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button className="btn cancel-btn" onClick={() => setSection("dashboard")}>← Back</button>
        </>
      )}

      {/* ================= ADD USER ================= */}
      {section === "addUser" && (
        <>
          <h2 className="form-title">Add New User</h2>

          <input
            className="input"
            placeholder="Username"
            value={userForm.username}
            onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
            disabled={loadingUsers}
          />

          <input
            className="input"
            placeholder="Email"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            disabled={loadingUsers}
          />

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            disabled={loadingUsers}
          />

          <select
            className="input"
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            disabled={loadingUsers}
          >
            <option value="user">User (Can access skills)</option>
            <option value="admin">Admin (Can manage everything)</option>
          </select>

          {messageUsers && (
            <div className={`message ${messageUsers.includes("successfully") ? "success" : "error"}`}>
              {messageUsers}
            </div>
          )}

          <div className="button-row">
            <button
              className="btn add-btn"
              onClick={handleAddUser}
              disabled={loadingUsers}
            >
              {loadingUsers ? "Adding..." : "Add User"}
            </button>
            <button className="btn cancel-btn" onClick={() => setSection("users")}>← Back</button>
          </div>
        </>
      )}
    </div>
  );
}
