import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SeatGrid.css';
import api from '../../axios';

const SeatGrid = ({ hallId }) => {
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
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
  const [successMessage, setSuccessMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const projectionId = new URLSearchParams(location.search).get('projectionId');
  const seatPrice = 12;

  useEffect(() => {
    api.get(`/seats/hall/${hallId}`)
      .then(res => setSeats(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSeats([]));
  }, [hallId]);

  const toggleSeat = (seatId) => {
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleReservation = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!token || !userId) {
      setSuccessMessage("You must be logged in to make a reservation.");
      return;
    }

    let payload;
    let apiUrl;

    if (projectionId) {
      payload = {
        userId: parseInt(userId),
        projectionId: parseInt(projectionId),
        seatIds: selected,
        type: ticketType
      };
      apiUrl = "http://localhost:8089/api/tickets";
    } else {
      if (!rentalStart || !rentalEnd) {
        setSuccessMessage("Please select the rental start and end times.");
        return;
      }
      payload = {
        userId: parseInt(userId),
        hallId: parseInt(hallId),
        seatIds: selected,
        startTime: rentalStart,
        endTime: rentalEnd,
      };
      apiUrl = "http://localhost:8089/api/halls/reserve";
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
        const reservationId = await response.text();
        setShowPreview(!!projectionId);
        setReservedSeats(selected);
        setSuccessMessage("Reservation successful!");

        if (ticketType === 'E_TICKET' && projectionId) {
          const pdfRes = await api.get(`/tickets/pdf/${reservationId}`, {
            responseType: 'blob',
            headers: { Authorization: `Bearer ${token}` }
          });
          const blob = new Blob([pdfRes.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ticket.pdf';
          a.click();
        } else if (ticketType === 'EMAIL_TICKET' && projectionId) {
          setShowEmailModal(true);
          setEmailInput('');
          window._reservationId = reservationId;
        }

        const updated = await api.get(`/seats/hall/${hallId}`);
        setSeats(updated.data);
        setRentalStart('');
        setRentalEnd('');
      } else {
        const text = await response.text();
        setSuccessMessage("Error: " + text);
      }
    } catch (err) {
      setSuccessMessage("Error: " + (err?.response?.data || err.message));
    }
  };
  const handlePayment = async () => {
  const totalAmount = reservedSeats.length * seatPrice;

  try {
    const response = await fetch('http://localhost:8089/api/payment/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount * 100, // Stripe expects amount in cents
        movieTitle: selectedProjection?.movieTitle || 'Cinema Ticket'
      })
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setSuccessMessage("Failed to redirect to Stripe.");
    }
  } catch (err) {
    console.error("Stripe checkout error:", err);
    setSuccessMessage("Payment failed. Please try again.");
  }
};
 const handlePaymentTwo = async () => {
  const totalAmount = reservedSeats.length * seatPrice;

  try {
    const response = await fetch('http://localhost:8089/api/payment/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount * 100, // Stripe expects amount in cents
        movieTitle: selectedProjection?.movieTitle || 'Cinema Ticket'
      })
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setSuccessMessage("Failed to redirect to Stripe.");
    }
  } catch (err) {
    console.error("Stripe checkout error:", err);
    setSuccessMessage("Payment failed. Please try again.");
  }
};

  const sendEmail = async () => {
    if (!emailInput || !window._reservationId) return;
    await api.post(`/tickets/email/${window._reservationId}?email=${emailInput}`);
    setShowEmailModal(false);
    setSuccessMessage("Ticket sent to your email.");
  };

  const seatLabels = reservedSeats
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
      <div className="seat-grid">
        {Object.entries(seats.reduce((acc, seat) => {
          const row = seat.rowNumber;
          if (!acc[row]) acc[row] = [];
          acc[row].push(seat);
          return acc;
        }, {})).map(([row, seatsInRow]) => (
          <div key={row} className="seat-row">
            {seatsInRow.map(seat => {
              const isSelected = selected.includes(seat.id);
              const isReserved = reservedSeats.includes(seat.id);

              return (
                <div
                  key={seat.id}
                  className={`seat ${seat.taken ? 'taken' : ''} ${isSelected || isReserved ? 'selected' : ''}`}
                  onClick={() => {
                    if (!seat.taken && !isReserved) {
                      toggleSeat(seat.id);
                    }
                  }}
                >
                  {String.fromCharCode(64 + seat.rowNumber)}{seat.seatNumber}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="summary enhanced-summary">
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
              <label>Start:</label>
              <input type="datetime-local" value={rentalStart} onChange={e => setRentalStart(e.target.value)} />
              <label>End:</label>
              <input type="datetime-local" value={rentalEnd} onChange={e => setRentalEnd(e.target.value)} />
            </div>
          )}
          <p><strong>Selected:</strong> {selected.length} seats</p>
          <p><strong>Total:</strong> {(selected.length * seatPrice).toFixed(2)} BAM</p>
          <button onClick={handleReservation} className="btn-reserve">✅ Confirm reservation</button>
        </div>
      )}

      {successMessage && <div className="message success">{successMessage}</div>}

      {showPreview && selectedProjection && (
        <div className="ticket-preview">
          <h3>🎟️ Your Ticket</h3>
          <p><strong>Movie:</strong> {selectedProjection.movieTitle}</p>
          <p><strong>Hall:</strong> {selectedProjection.hallName}</p>
          <p><strong>Time:</strong> {new Date(selectedProjection.startTime).toLocaleString()}</p>
          <p><strong>Seats:</strong> {seatLabels}</p>
          <p><strong>Total:</strong> {(reservedSeats.length * seatPrice).toFixed(2)} BAM</p>
          <button onClick={handlePaymentTwo} className="btn-reserve">💳 Pay Now</button>
        </div>
      )}

      {showEmailModal && (
        <div className="email-modal">
          <div className="email-content">
            <h4>Enter your email:</h4>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your@email.com"
            />
            <button onClick={sendEmail}>Send Ticket</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatGrid;
