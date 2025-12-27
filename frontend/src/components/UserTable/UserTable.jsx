import React, { useState, useEffect } from "react";
import Filters from "../Filters/Filters";
import UserRow from "../UserRow/UserRow";
import "./UserTable.css";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import EditUserModal from "../EditUserModal/EditUserModal";
import AddUserModal from "../AddUserModal/AddUserModal";
import { FaUserPlus } from "react-icons/fa";
import AdminLayout from "../AdminLayout";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8089/api/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to fetch users (${res.status})`);
        }
        return res.json();
      })
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.firstName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (user.email || "").toLowerCase().includes((searchTerm || "").toLowerCase());

    const matchesRole = role === "" || user.role === role;
    const matchesStatus = status === "" || user.userStatus === status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = (id) => {
    setSelectedUser(users.find((u) => u.id === id));
    setShowConfirmModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = (id, updatedData) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8089/api/users/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Update failed (${res.status})`);
        }
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));
        setShowEditModal(false);
        setSelectedUser(null);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        alert("Failed to update user.");
      });
  };

  const confirmDelete = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8089/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Failed to delete user (${res.status})`);
        }
        setUsers((prev) => prev.filter((user) => user.id !== id));
        setShowConfirmModal(false);
        setSelectedUser(null);
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Error deleting user.");
      });
  };

  // ✅ ADMIN ADD USER (returns {ok, message} for modal)
  const handleAddUser = async (newUserData) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8089/api/users/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUserData),
      });

      const text = await res.text().catch(() => "");

      if (!res.ok) {
        return { ok: false, message: text || `Failed to add user (${res.status})` };
      }

      // backend vraća string (User created successfully.) ali ostavljamo fallback
      let createdUser = null;
      try {
        createdUser = text ? JSON.parse(text) : null;
      } catch (_) {
        createdUser = null;
      }

      const uiUser = createdUser || { id: Date.now(), ...newUserData };
      setUsers((prev) => [...prev, uiUser]);

      setShowAddModal(false);
      return { ok: true, user: uiUser };
    } catch (err) {
      return { ok: false, message: err?.message || "Error adding user." };
    }
  };

  return (
    <AdminLayout>
      <div className="user-header-top">
        <h2 className="user-page-title">User Management</h2>
        <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
          <FaUserPlus style={{ marginRight: "6px" }} />
          Add User
        </button>
      </div>

      <div className="table-container">
        <h3>List of Users</h3>
        <p className="subtitle_user">Manage all registered users, roles and activity status</p>

        <Filters setRole={setRole} setStatus={setStatus} setSearchTerm={setSearchTerm} />

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <UserRow key={user.id} user={user} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </tbody>
        </table>

        <ConfirmDeleteModal
          visible={showConfirmModal}
          user={selectedUser}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedUser(null);
          }}
        />

        <EditUserModal
          visible={showEditModal}
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveEdit}
        />

        <AddUserModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      </div>
    </AdminLayout>
  );
};

export default UserTable;
