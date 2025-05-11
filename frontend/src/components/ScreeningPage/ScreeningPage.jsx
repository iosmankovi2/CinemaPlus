import React, { useState, useEffect } from "react";
import "./ScreeningPage.css";
import ConfirmDeleteModal from "../ConfirmDeleteProjectionModal/ConfirmDeleteProjectionModal";
import AddScreeningModal from "../AddScreeningsModal/AddScreeningsModal";
import EditScreeningModal from "../EditScreeningModal/EditScreeningModal";
const ScreeningsPage = () => {
  const [screenings, setScreenings] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProjection, setEditingProjection] = useState(null);
  
  useEffect(() => {
    fetch("/api/projections/all")
      .then(res => res.json())
      .then(data => setScreenings(data))
      .catch(err => console.error("Error loading projections:", err));
  }, []);

  const handleEdit = (id) => {
    const projection = screenings.find((p) => p.id === id);
    setEditingProjection(projection);
    setShowEditModal(true);
  };
  
  const formatProjectionType = (type) => {
    switch (type) {
      case "TWO_D":
        return "2D";
      case "THREE_D":
        return "3D";
      case "FOUR_DX":
        return "4DX";
      default:
        return type;
    }
  };
const handleCancel = (id) => {
        const projection = screenings.find(p => p.id === id);
        setSelectedProjection(projection);
        setShowConfirmModal(true);
      }; 
      const confirmDelete = () => {
        fetch(`/api/projections/${selectedProjection.id}`, {
          method: "DELETE"
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to delete screening.");
            setScreenings(prev => prev.filter((s) => s.id !== selectedProjection.id));
            setShowConfirmModal(false);
            setSelectedProjection(null);
          })
          .catch((err) => {
            console.error("Delete failed:", err);
            alert("Could not cancel the screening.");
          });
      };
       
  return (
    <div className="screenings-container">
      <div className="screenings-header">
        <h2>Screenings</h2>
        <button className="add-screening-btn" onClick={() => setShowAddModal(true)}>
  + Add Screening
</button>
      </div>

      <div className="screenings-card">
        <h3>Upcoming Screenings</h3>
        <p className="subtitle">Manage all upcoming movie screenings</p>
        <table className="screenings-table">
          <thead>
            <tr>
            <th>Movie</th>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Price</th>
            <th>Hall</th>
            <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {screenings.map((p) => {
              const startDate = new Date(p.startTime);
              const date = startDate.toLocaleDateString();
              const time = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <tr key={p.id}>
                  <td>{p.movieTitle}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td>{formatProjectionType(p.projectionType)}</td>
                  <td>{p.ticketPrice} KM</td>
                  <td>{p.hallName}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(p.id)}>✏️ Edit</button>
                    <button className="cancel-btn" onClick={() => handleCancel(p.id)}>🗑 Cancel</button>
                  </td>
                </tr>
              );
              
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal
            visible={showConfirmModal}
            itemName={selectedProjection?.movieTitle + " - " + new Date(selectedProjection?.startTime).toLocaleString()}
            onConfirm={confirmDelete}
            onCancel={() => {
            setShowConfirmModal(false);
            setSelectedProjection(null);}}/>
      <AddScreeningModal
            visible={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={(form) => {
              fetch("/api/projections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
              })
                .then(res => {
                  if (!res.ok) throw new Error("Failed to add screening");
                  return res.json();
                })
                .then(newScreening => {
                  setScreenings(prev => [...prev, newScreening]);
                  setShowAddModal(false);
                })
                .catch(err => {
                  console.error(err);
                  alert("Could not add screening.");
                });
        }}/>
        <EditScreeningModal
            visible={showEditModal}
            projection={editingProjection}
            onClose={() => {
              setShowEditModal(false);
              setEditingProjection(null);
            }}
            onSave={(id, updatedForm) => {
              fetch(`/api/projections/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedForm)
              })
                .then(res => {
                  if (!res.ok) throw new Error("Failed to update screening");
                  return res.json();
                })
                .then(updated => {
                  setScreenings(prev => prev.map(p => p.id === id ? { ...p, ...updatedForm } : p));
                  setShowEditModal(false);
                  setEditingProjection(null);
                })
                .catch(err => {
                  console.error(err);
                  alert("Could not update screening.");
                });
            }}
        />

            </div>
          );
          
        };

export default ScreeningsPage;
