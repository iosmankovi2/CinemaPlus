import React, { useEffect, useState } from 'react';
import './SeatGrid.css';
import { useLocation } from 'react-router-dom';

const SeatGrid = ({ hallId }) => {
  const location = useLocation();
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hallName, setHallName] = useState(location.state?.hallName || '');

  useEffect(() => {
    fetch(`http://localhost:8089/api/seats/hall/${hallId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSeats(data);
        } else {
          console.error("Podaci nisu niz:", data);
          setSeats([]);
        }
      })
      .catch(err => {
        console.error("Greška pri dohvaćanju sjedišta:", err);
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
        alert("Uspješna rezervacija!");
        setSelected([]);
        const refresh = await fetch(`http://localhost:8089/api/seats/hall/${hallId}`);
        const updated = await refresh.json();
        setSeats(updated);
      } else {
        const text = await response.text();
        alert("Greška: " + text);
      }
    } catch (error) {
      alert("Došlo je do greške prilikom rezervacije.");
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
      <h2>Odaberi sjedišta</h2>
      <h3>Rezervacija za: {hallName}</h3>
      <div className="screen">EKRAN</div>
      <div className="seat-grid">{renderGrid()}</div>

      {selected.length > 0 && (
        <div className="summary">
          <button className="btn-reserve" onClick={handleReservation}>
            Potvrdi rezervaciju
          </button>
          <p>Odabrano: {selected.length} sjedišta</p>
          <p>Ukupno: {selected.length * 12}.00 KM</p>
        </div>
      )}
    </div>
  );
};

export default SeatGrid;