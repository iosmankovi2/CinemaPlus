import React, { useEffect, useState } from "react";
import "./EditScreeningModal.css"; 

const EditScreeningModal = ({ visible, onClose, onSave, projection }) => {
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
    if (projection && movies.length > 0 && halls.length > 0) {
      const selectedMovie = movies.find(m => m.title === projection.movieTitle);
      const selectedHall = halls.find(h => h.name === projection.hallName);
  
      setForm({
        movieId: selectedMovie?.id || "",
        hallId: selectedHall?.id || "",
        startTime: projection.startTime.slice(0, 16),
        projectionType: projection.projectionType,
        ticketPrice: projection.ticketPrice
      });
    }
  }, [projection, movies, halls]);
  

  useEffect(() => {
    fetch("/api/movies").then(res => res.json()).then(setMovies);
    fetch("/api/halls").then(res => res.json()).then(setHalls);
  }, []);

  if (!visible) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "movieId" || name === "hallId" ? Number(value) : value
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(projection.id, form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Edit Screening</h3>
        <form onSubmit={handleSubmit} className="screening-form">

          <label>Movie</label>
          <select name="movieId" value={form.movieId} onChange={handleChange} required>
            {movies.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <label>Hall</label>
          <select name="hallId" value={form.hallId} onChange={handleChange} required>
            {halls.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <label>Start Time</label>
          <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />

          <label>Projection Type</label>
          <select name="projectionType" value={form.projectionType} onChange={handleChange} required>
            <option value="TWO_D">2D</option>
            <option value="THREE_D">3D</option>
            <option value="FOUR_DX">4DX</option>
          </select>

          <label>Ticket Price (KM)</label>
          <input type="number" step="0.5" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} required />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="confirm-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScreeningModal;
