import React, { useEffect, useState } from 'react';
import './SeatGrid.css';
import { useLocation } from 'react-router-dom';

const SeatGrid = ({ hallId }) => {
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hallName, setHallName] = useState(location.state?.hallName || '');
  const [ticketType, setTicketType] = useState('E_TICKET'); // Možda relevantno za samostalni zakup?
  const [showPreview, setShowPreview] = useState(false);
  const [selectedProjection, setSelectedProjection] = useState(
    JSON.parse(localStorage.getItem('selectedProjection')) || null
  );
  const [isHallRental, setIsHallRental] = useState(!location.search.includes('projectionId'));

  const projectionId = new URLSearchParams(location.search).get('projectionId');

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

  const handleReservation = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert("You must be logged in to make a reservation.");
      return;
    }

    let payload;
    let apiUrl;

    if (projectionId) {
      // Rezervacija za projekciju filma
      payload = {
        userId: parseInt(userId),
        projectionId: parseInt(projectionId),
        seatIds: selected,
        type: ticketType
      };
      apiUrl = "http://localhost:8089/api/tickets";
    } else {
      // Samostalna rezervacija sale
      payload = {
        userId: parseInt(userId),
        hallId: parseInt(hallId),
        seatIds: selected, // Možda želiš rezervirati specifična sjedala ili cijelu salu
        // Ovdje bi idealno bilo imati i podatke o vremenu zakupa
      };
      apiUrl = "http://localhost:8089/api/halls/reserve"; // Pretpostavljena nova API ruta
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(projectionId ? "Reservation successful!" : "Hall reservation successful!");
        setShowPreview(!!projectionId); // Prikazuj preview samo za rezervacije karata
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
          {projectionId && (
            <>
              <label>Delivery Method:</label>
              <select value={ticketType} onChange={e => setTicketType(e.target.value)}>
                <option value="E_TICKET">Download PDF</option>
                <option value="EMAIL_TICKET">Email</option>
                <option value="PHYSICAL_PICKUP">Pick up</option>
              </select>
            </>
          )}
          <button onClick={handleReservation} className="btn-reserve">Confirm reservation</button>
          <p>Selected: {selected.length} seats</p>
          <p>Total: {(selected.length * 12).toFixed(2)} BAM</p>
          {isHallRental && (
            <p className="rental-note">Note: This is a hall rental. Please confirm the rental period and price.</p>
          )}
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