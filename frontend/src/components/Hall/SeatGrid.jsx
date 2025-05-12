import React, { useEffect, useState } from 'react';
import './SeatGrid.css';
import { useLocation } from 'react-router-dom';

const SeatGrid = ({ hallId }) => {
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hallName, setHallName] = useState(location.state?.hallName || '');
  const [ticketType, setTicketType] = useState('E_TICKET');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState(
    JSON.parse(localStorage.getItem('selectedProjection')) || null
  );

  const projectionId = new URLSearchParams(location.search).get('projectionId');

  // Dohvati sjedišta za salu
  useEffect(() => {
    fetch(`http://localhost:8089/api/seats/hall/${hallId}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setSeats(data) : setSeats([]))
      .catch(() => setSeats([]));
  }, [hallId]);

  const toggleSeat = (seatId) => {
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  // Rezervacija
  const handleReservation = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId || !projectionId) {
      alert("Missing authentication or projection info");
      return;
    }

    const payload = {
      userId: parseInt(userId),
      projectionId: parseInt(projectionId),
      seatIds: selected,
      type: ticketType
    };

    try {
      const response = await fetch("http://localhost:8089/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Reservation successful!");
        setShowPreview(true);
        setSelected([]);
        const updated = await fetch(`http://localhost:8089/api/seats/hall/${hallId}`).then(r => r.json());
        setSeats(updated);
      } else {
        const text = await response.text();
        alert("Error: " + text);
      }
    } catch (err) {
      alert("Failed to fetch: " + err.message);
    }
  };

  // Raspored sjedala po redovima
  const renderGrid = () => {
    const grouped = {};
    seats.forEach(seat => {
      if (!grouped[seat.rowNumber]) grouped[seat.rowNumber] = [];
      grouped[seat.rowNumber].push(seat);
    });

    return Object.keys(grouped).sort().map(row => (
      <div key={row} className="seat-row">
        {grouped[row].map(seat => (
          <div
            key={seat.id}
            className={`seat ${seat.taken ? 'taken' : ''} ${selected.includes(seat.id) ? 'selected' : ''}`}
            onClick={() => !seat.taken && toggleSeat(seat.id)}
          >
            {String.fromCharCode(64 + seat.rowNumber)}{seat.seatNumber}
          </div>
        ))}
      </div>
    ));
  };

  const seatLabels = selected
    .map(id => {
      const s = seats.find(seat => seat.id === id);
      return s ? `${String.fromCharCode(64 + s.rowNumber)}${s.seatNumber}` : '';
    })
    .join(', ');

  return (
    <div className="seat-grid-wrapper">
      <h2>Select seats</h2>
      <h3>Reservation for: {hallName}</h3>
      <div className="screen">SCREEN</div>
      <div className="seat-grid">{renderGrid()}</div>

      {selected.length > 0 && (
        <div className="summary">
          <label>Delivery Method:</label>
          <select value={ticketType} onChange={e => setTicketType(e.target.value)}>
            <option value="E_TICKET">Download PDF</option>
            <option value="EMAIL_TICKET">Email</option>
            <option value="PHYSICAL_PICKUP">Pick up</option>
          </select>
          <button onClick={handleReservation} className="btn-reserve">Confirm reservation</button>
          <p>Selected: {selected.length} seats</p>
          <p>Total: {(selected.length * 12).toFixed(2)} BAM</p>
        </div>
      )}

      {showPreview && selectedProjection && (
        <div className="ticket-preview">
          <h3>🎟️ Your Ticket</h3>
          <p><strong>Movie:</strong> {selectedProjection.movieTitle}</p>
          <p><strong>Hall:</strong> {selectedProjection.hallName}</p>
          <p><strong>Time:</strong> {new Date(selectedProjection.startTime).toLocaleString()}</p>
          <p><strong>Seats:</strong> {seatLabels}</p>
          <p><strong>Total:</strong> {(selected.length * 12).toFixed(2)} BAM</p>
        </div>
      )}
    </div>
  );
};

export default SeatGrid;
