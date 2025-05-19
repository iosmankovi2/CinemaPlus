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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isHallRental, setIsHallRental] = useState(!location.search.includes('projectionId'));
  const [rentalStart, setRentalStart] = useState('');
  const [rentalEnd, setRentalEnd] = useState('');

  const projectionId = new URLSearchParams(location.search).get('projectionId');

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [localStorage.getItem('token')]);

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
      if (!rentalStart || !rentalEnd) {
        alert("Please select the rental start and end times.");
        return;
      }
      payload = {
        userId: parseInt(userId),
        hallId: parseInt(hallId),
        seatIds: selected, // Možda želiš rezervirati specifična sjedala ili cijelu salu
        startTime: rentalStart,
        endTime: rentalEnd,
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
        setRentalStart('');
        setRentalEnd('');
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
          {isLoggedIn && isHallRental && (
  <div className="rental-period">
    <div className="rental-time-input">
      <label htmlFor="rentalStart">Start Time:</label>
      <input
        type="datetime-local"
        id="rentalStart"
        value={rentalStart}
        onChange={(e) => setRentalStart(e.target.value)}
        required
      />
    </div>
    <div className="rental-time-input">
      <label htmlFor="rentalEnd">End Time:</label>
      <input
        type="datetime-local"
        id="rentalEnd"
        value={rentalEnd}
        onChange={(e) => setRentalEnd(e.target.value)}
        required
      />
    </div>
  </div>
)}
          <p>Selected: {selected.length} seats</p>
          <p>Total: {(selected.length * 12).toFixed(2)} BAM</p>
          {isLoggedIn && (
            <button onClick={handleReservation} className="btn-reserve">Confirm reservation</button>
          )}
          {!isLoggedIn && (
            <p>You need to be logged in to make a reservation.</p>
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