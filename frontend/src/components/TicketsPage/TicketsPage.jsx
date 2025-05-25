import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import ".././ScreeningPage/ScreeningPage.css"

const TicketsPage = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetch("/api/tickets/all")
            .then((res) => res.json())
            .then((data) => setTickets(data))
            .catch((err) => console.error("Error loading tickets:", err));
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
                            <td>{ticket.seats.join(", ")}</td>
                            <td>{ticket.price} KM</td>
                            <td>
                                {new Date(ticket.purchasedAt).toLocaleString([], {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
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
