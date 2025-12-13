import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import ".././ScreeningPage/ScreeningPage.css";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/tickets/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const text = await res.text().catch(() => "");

        if (!res.ok) {
          throw new Error(text || `Failed to load tickets (${res.status})`);
        }

        return text ? JSON.parse(text) : [];
      })
      .then((data) => setTickets(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error loading tickets:", err.message));
  }, []);

  return (
    <AdminLayout>
      <h2 className="screen-page-title">Purchased Tickets</h2>

      <div className="screenings-card">
        <h3>All Tickets</h3>
        <p className="subtitle_screen">Overview of all purchased tickets</p>

        <table className="screenings-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Movie</th>
              <th>Date</th>
              <th>Time</th>
              <th>Hall</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Purchased At</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.userName}</td>
                <td>{ticket.movieTitle}</td>
                <td>{ticket.date}</td>
                <td>{ticket.time}</td>
                <td>{ticket.hallName}</td>
                <td>{Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ""}</td>
                <td>{ticket.price} KM</td>
                <td>
                  {ticket.purchasedAt
                    ? new Date(ticket.purchasedAt).toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default TicketsPage;
