import React, { useEffect, useState } from 'react';
import './SeatGrid.css';
import { useLocation } from 'react-router-dom';

const SeatGrid = ({ hallId }) => {
  const location = useLocation();
  const hallName = location.state?.hallName || '';
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8089/api/seats/hall/${hallId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSeats(data);
        } else {
          console.error("Data is not an array:", data);
          setSeats([]);
        }
      })
      .catch(err => {
        console.error("Error fetching seats:", err);
        setSeats([]);
      });
  }, [hallId]);

  const toggleSeat = (seatId) => {
    setSelected(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleReservation = async () => {
    try {
      const response = await fetch("http://localhost:8089/api/seats/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seatIds: selected }),
      });

      if (response.ok) {
        alert("Reservation successful!");
        setSelected([]);
        const refresh = await fetch(`http://localhost:8089/api/seats/hall/${hallId}`);
        const updated = await refresh.json();
        setSeats(updated);
      } else {
        const text = await response.text();
        alert("Error: " + text);
      }
    } catch (error) {
      alert("An error occurred during reservation.");
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

  return (
    <div className="seat-grid-wrapper">
      <h2>Select seats</h2>
      <h3>Reservation for: {hallName}</h3>
      <div className="screen">SCREEN</div>
      <div className="seat-grid">{renderGrid()}</div>

      {selected.length > 0 && (
        <div className="summary">
          <button className="btn-reserve" onClick={handleReservation}>
            Confirm reservation
          </button>
          <p>Selected: {selected.length} seats</p>
          <p>Total: {selected.length * 12}.00 BAM</p>
        </div>
      )}
    </div>
  );
};

export default SeatGrid;