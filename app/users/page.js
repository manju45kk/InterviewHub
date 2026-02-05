"use client";
import { useEffect, useState } from "react";
import "./user.css";
import UserDetails from "./UserDetails";
import { UseContextProvider, useUserContext } from "./UserContext";

function User() {
  const { setUserDetails } = useUserContext();

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data?.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) return;

    await fetch("/api/users", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editingId
          ? { id: editingId, ...formData }
          : { id: Date.now(), ...formData }
      ),
    });

    setFormData({ name: "", email: "", address: "" });
    setEditingId(null);
    setShowForm(false);
    fetchUsers();
  };

  /* ================= ACTIONS ================= */
  const handleEdit = (user) => {
    setFormData(user);
    setEditingId(user.id);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleDelete = async (id) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  const handleView = (user) => {
    setUserDetails(user);
    setShowDetails(true);
    setShowForm(false);
  };

  const handleBack = () => {
    setShowDetails(false);
  };

  /* ================= UI ================= */
  if (showDetails) {
    return <UserDetails onBack={handleBack} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="table-header">
        <h3>Users</h3>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          Add User
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form className="user-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <button className="btn" type="submit">
            {editingId ? "Update" : "Submit"}
          </button>
        </form>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      <table className="user-table desktop-only">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users added
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td className="text-center">
                  <button className="btn" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="btn" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                  <button className="btn" onClick={() => handleView(user)}>
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= MOBILE CARDS ================= */}
      <div className="mobile-only user-cards">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <div className="row">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>
            <div className="row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="row">
              <span>Address</span>
              <strong>{user.address}</strong>
            </div>

            <div className="card-actions">
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
              <button onClick={() => handleView(user)}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= PROVIDER WRAP ================= */
export default function UsersPage() {
  return (
    <UseContextProvider>
      <User />
    </UseContextProvider>
  );
}
