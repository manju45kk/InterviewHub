"use client";
import { useEffect, useState } from "react";
import "./user.css";
import UserDetails from "./UserDetails"
import { UseContextProvider, useUserContext } from "./UserContext";

export default function UsersPage() {

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

    const fetchUsers = async () => {
      fetch('/api/users').then((res) => res.json()).then((result) => {
        setUsers(result?.users)
      })
    }
    useEffect(() => {
      fetchUsers()
    }, [])

    // handle input change
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // add / update user
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.name || !formData.email || !formData.address) return;

      if (editingId) {

        fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        const requestBody = { id: Date.now(), ...formData };
        console.log('requestBody', requestBody)
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

      }

      setFormData({ name: "", email: "", address: "" });
      setEditingId(null);
      setShowForm(false);
      setShowDetails(false);
      fetchUsers();
    };

    // edit user
    const handleEdit = (user) => {
      setFormData(user);
      setEditingId(user.id);
      setShowForm(true);
      setShowDetails(false);
    };

    // delete user
    const handleDelete = (id) => {
      fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setUsers(users.filter((u) => u.id !== id));
    };

    const handleView = (user) => {
      setUserDetails(user);
      setShowDetails(true);
      setShowForm(false);
    };

    const onBack = () => {
      setShowDetails(false);
      setShowForm(true);
    }

    return (<>
      {showDetails ? <UserDetails onBack={onBack} /> : <div>
        {/* Header */}
        <div className="table-header">
          <h3>Users</h3>
          <button onClick={() => setShowForm(!showForm)}>
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
            <button type="submit">
              {editingId ? "Update" : "Submit"}
            </button>
          </form>
        )}

        {/* Table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No users added
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user?.id}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.address}</td>
                  <td className="text-center">
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                    <button onClick={() => handleView(user)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>}
    </>);
  }

  return (
    <UseContextProvider>
      <User />
    </UseContextProvider>
  )
}
