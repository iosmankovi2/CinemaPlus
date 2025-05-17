import React, { useState, useEffect } from "react";
import Filters from "../Filters/Filters";
import UserRow from "../UserRow/UserRow";
import "./UserTable.css";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import EditUserModal from "../EditUserModal/EditUserModal";
import AddUserModal from "../AddUserModal/AddUserModal";
import { FaUserPlus} from "react-icons/fa";


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
    fetch("/api/users/")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data); 
        setUsers(data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);
  

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm);
  
    const matchesRole = role === "" || user.role === role;
    const matchesStatus = status === "" || user.userStatus === status;
  
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleDelete = (id) => {
    console.log(id)
    setSelectedUser(users.find(u => u.id === id));
    setShowConfirmModal(true);
  };
  const handleEdit = (user) => {
  setSelectedUser(user);
  setShowEditModal(true);
};

const handleSaveEdit = (id, updatedData) => {
  const token = localStorage.getItem("token"); 

  fetch(`/api/users/admin/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`  
    },
    body: JSON.stringify(updatedData),
  })
    .then((res) => {
      console.log(updatedData);
      if (!res.ok) throw new Error("Update failed");
      setUsers(users.map((u) => (u.id === id ? { ...u, ...updatedData } : u)));
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
    fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  
      },
    })
      .then((res) => {
        console.log("API response:", res); 
        if (!res.ok) throw new Error("Failed to delete user");
        setUsers(users.filter((user) => user.id !== id));
        setShowConfirmModal(false);
        setSelectedUser(null);
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Error deleting user.");
      });
  };
  const handleAddUser = (newUserData) => {
    fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUserData)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add user");
        return res.text();
      })
      .then(() => {
        setUsers([...users, { id: Date.now(), ...newUserData }]); // ili refetch
        setShowAddModal(false);
      })
      .catch((err) => {
        console.error("Add user failed:", err);
        alert("Error adding user.");
      });
  };
  
  
  return (
    <div className="user-header">
    <div className="user-header-top">
      <h2 className="user-page-title">User Management</h2>
      <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
        <FaUserPlus style={{ marginRight: "6px" }} />
        Add User
      </button>
  </div>
    <div className="table-container">
    <h3>List of Users</h3>
    <p className="subtitle">Manage all registered users, roles and activity status</p>
      <Filters setRole={setRole} setStatus={setStatus} setSearchTerm={setSearchTerm}/>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Bookings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <UserRow key={user.id} user={user} onDelete={handleDelete} onEdit={handleEdit}/>))}
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
    </div>
  );
  
};


export default UserTable;
