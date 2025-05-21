import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SeatGrid.css';
import api from '../../axios';

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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  // Dohvati sjedišta za salu
  useEffect(() => {
    fetch(`http://localhost:8089/api/seats/hall/${hallId}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setSeats(data) : setSeats([]))
=======
  useEffect(() => {
    api.get(`/seats/hall/${hallId}`)
      .then(res => setSeats(Array.isArray(res.data) ? res.data : []))
>>>>>>> Stashed changes
=======
  useEffect(() => {
    api.get(`/seats/hall/${hallId}`)
      .then(res => setSeats(Array.isArray(res.data) ? res.data : []))
>>>>>>> Stashed changes
      .catch(() => setSeats([]));
  }, [hallId]);

  const toggleSeat = (seatId) => {
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  // Rezervacija
  const handleReservation = async () => {
    const userId = localStorage.getItem('userId');
<<<<<<< Updated upstream
<<<<<<< Updated upstream

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
=======
=======
>>>>>>> Stashed changes
    if (!userId) {
      alert("You must be logged in to make a reservation.");
      return;
    }

    let payload;
    let apiPath;

    if (projectionId) {
      payload = {
        userId: parseInt(userId),
        projectionId: parseInt(projectionId),
        seatIds: selected,
        type: ticketType
      };
      apiPath = "/tickets";
    } else {
      if (!rentalStart || !rentalEnd) {
        alert("Please select the rental start and end times.");
        return;
      }
      payload = {
        userId: parseInt(userId),
        hallId: parseInt(hallId),
        seatIds: selected,
        startTime: rentalStart,
        endTime: rentalEnd,
      };
      apiPath = "/halls/reserve";
    }

    try {
      const res = await api.post(apiPath, payload);
      const reservationId = res.data;

      alert("Reservation successful!");
      setShowPreview(!!projectionId);
      setSelected([]);

      if (ticketType === 'E_TICKET') {
        try {
          const pdfRes = await api.get(`/tickets/pdf/${reservationId}`, {
            responseType: 'blob'
          });

          // Provjera da li je stvarno PDF
          const contentType = pdfRes.headers['content-type'];
          if (contentType !== 'application/pdf') {
            const text = await pdfRes.data.text();
            alert("Error: " + text);
            return;
          }

          const blob = new Blob([pdfRes.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ticket.pdf';
          a.click();
        } catch (err) {
          if (err.response?.status === 500) {
            const text = await err.response.data.text?.();  // pokušaj dohvatiti poruku iz PDF-a
            alert("Download error (500): " + (text || "Internal Server Error"));
          } else {
            alert("Download error: " + (err?.message || "Unknown error"));
          }
        }


      } else if (ticketType === 'EMAIL_TICKET') {
        const email = prompt("Enter your email address:");
        if (email) {
          await api.post(`/tickets/email/${reservationId}?email=${email}`);
          alert("Ticket sent to your email.");
        }
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      } else {
        alert("Your ticket will be available at the cinema.");
      }

      const updated = await api.get(`/seats/hall/${hallId}`);
      setSeats(updated.data);
      setRentalStart('');
      setRentalEnd('');
    } catch (err) {
      alert("Error: " + (err?.response?.data || err.message));
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
<<<<<<< Updated upstream
          <label>Delivery Method:</label>
          <select value={ticketType} onChange={e => setTicketType(e.target.value)}>
            <option value="E_TICKET">Download PDF</option>
            <option value="EMAIL_TICKET">Email</option>
            <option value="PHYSICAL_PICKUP">Pick up</option>
          </select>
          <button onClick={handleReservation} className="btn-reserve">Confirm reservation</button>
          <p>Selected: {selected.length} seats</p>
          <p>Total: {(selected.length * 12).toFixed(2)} BAM</p>
=======
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
                />
              </div>
              <div className="rental-time-input">
                <label htmlFor="rentalEnd">End Time:</label>
                <input
                  type="datetime-local"
                  id="rentalEnd"
                  value={rentalEnd}
                  onChange={(e) => setRentalEnd(e.target.value)}
                />
              </div>
            </div>
          )}
          <p>Selected: {selected.length} seats</p>
          {isLoggedIn && <p>Total: {(selected.length * 12).toFixed(2)} BAM</p>}
          {isLoggedIn ? (
            <button onClick={handleReservation} className="btn-reserve">Confirm reservation</button>
          ) : (
            <p>You need to be logged in to make a reservation.</p>
          )}
>>>>>>> Stashed changes
        </div>
      )}

      {showPreview && selectedProjection && (
        <div className="ticket-preview">
          <h3>🎟️ Your Ticket</h3>
          <p><strong>Movie:</strong> {selectedProjection.movieTitle}</p>
          <p><strong>Hall:</strong> {selectedProjection.hallName}</p>
          <p><strong>Time:</strong> {new Date(selectedProjection.startTime).toLocaleString()}</p>
          <p><strong>Seats:</strong> {seatLabels}</p>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <p><strong>Total:</strong> {(selected.length * 12).toFixed(2)} BAM</p>
=======
          {isLoggedIn && <p><strong>Total:</strong> {(selected.length * 12).toFixed(2)} BAM</p>}
>>>>>>> Stashed changes
=======
          {isLoggedIn && <p><strong>Total:</strong> {(selected.length * 12).toFixed(2)} BAM</p>}
>>>>>>> Stashed changes
        </div>
      )}
    </div>
  );
};

export default SeatGrid;
