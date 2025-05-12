import React, { useEffect, useState } from 'react';
import './MyTickets.css';

const MyTickets = ({ userId }) => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetch(`/api/tickets/user/${userId}`)
      .then(res => res.json())
      .then(data => setTickets(data));
  }, [userId]);

  const filtered = tickets.filter(t => {
    const now = new Date();
    const ticketDate = new Date(t.date + 'T' + t.time);
    return filter === 'upcoming' ? ticketDate > now : ticketDate <= now;
  });

  return (
    <div className="my-tickets-container">
      <h2>My <span className="red">Tickets</span></h2>
      <div className="ticket-tabs">
        <button onClick={() => setFilter('upcoming')}>Upcoming</button>
        <button onClick={() => setFilter('past')}>Past Tickets</button>
      </div>
      <div className="ticket-grid">
        {filtered.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <h3>{ticket.movieTitle}</h3>
            <p>{ticket.date} @ {ticket.time}</p>
            <p><b>Ticket #{ticket.id}</b></p>
            <p>Seats: {ticket.seats.join(', ')}</p>
            <p className="price">${ticket.price}</p>
            <div className="ticket-actions">
              <button>🎫 View Ticket</button>
              <button>🛒 Buy More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
