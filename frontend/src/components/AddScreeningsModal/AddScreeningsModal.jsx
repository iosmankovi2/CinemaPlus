import React, { useState, useEffect } from "react";
import "./AddScreeningsModal.css"
const AddScreeningModal = ({ visible, onClose, onSave }) => {
  const [form, setForm] = useState({
    movieId: "",
    hallId: "",
    startTime: "",
    projectionType: "",
    ticketPrice: ""
  });

  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    fetch("/api/movies").then(res => res.json()).then(setMovies);
    fetch("/api/halls").then(res => res.json()).then(setHalls);
  }, []);

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add Screening</h3>
        <form onSubmit={handleSubmit} className="add-screening-form">

          <label>Movie</label>
          <select name="movieId" value={form.movieId} onChange={handleChange} required>
            <option value="">Select Movie</option>
            {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>

          <label>Hall</label>
          <select name="hallId" value={form.hallId} onChange={handleChange} required>
            <option value="">Select Hall</option>
            {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>

          <label>Start Time</label>
          <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />

          <label>Projection Type</label>
          <select name="projectionType" value={form.projectionType} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="TWO_D">2D</option>
            <option value="THREE_D">3D</option>
            <option value="FOUR_DX">4DX</option>
          </select>

          <label>Ticket Price (KM)</label>
          <input type="number" step="0.5" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} required />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="confirm-btn">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScreeningModal;
