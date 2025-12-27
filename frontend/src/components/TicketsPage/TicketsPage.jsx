import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import ".././ScreeningPage/ScreeningPage.css";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);

  // cancel modal state
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // success message state
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  const loadTickets = async () => {
    setSuccessMessage("");
    try {
      const res = await fetch("/api/tickets/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text().catch(() => "");
      if (!res.ok) throw new Error(text || `Failed to load tickets (${res.status})`);

      const data = text ? JSON.parse(text) : [];
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading tickets:", err.message);
      setTickets([]);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCancelPopup = (ticket) => {
    setCancelError("");
    setSuccessMessage("");

    if (!ticket?.reservationId) {
      setCancelError("Reservation ID is missing. Backend TicketDTO must include reservationId.");
      return;
    }

    const isCancelled = (ticket.status || "").toUpperCase() === "CANCELLED";
    if (isCancelled) return;

    setTicketToCancel(ticket);
    setShowCancelPopup(true);
  };

  const closeCancelPopup = () => {
    if (isCancelling) return;
    setShowCancelPopup(false);
    setTicketToCancel(null);
    setCancelError("");
  };

  const confirmCancelReservation = async () => {
    if (!ticketToCancel?.reservationId) {
      setCancelError("Reservation ID is missing.");
      return;
    }

    setIsCancelling(true);
    setCancelError("");
    setSuccessMessage("");

    // ✅ Optimistic UI update: odmah markiraj kao CANCELLED
    const reservationId = ticketToCancel.reservationId;
    const prevTickets = tickets;

    setTickets((prev) =>
      prev.map((t) =>
        t.reservationId === reservationId ? { ...t, status: "CANCELLED" } : t
      )
    );

    try {
      const res = await fetch(`/api/tickets/reservation/${reservationId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text().catch(() => "");
      if (!res.ok) {
        // rollback optimistic update if backend failed
        setTickets(prevTickets);
        throw new Error(text || `Cancel failed (${res.status})`);
      }

      closeCancelPopup();

      setSuccessMessage("Reservation cancelled successfully ✅");
    } catch (err) {
      setCancelError(err.message || "Cancel failed.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AdminLayout>
      <h2 className="screen-page-title">Purchased Tickets</h2>

      {successMessage && (
        <div className="success-banner">
    {successMessage}
  </div>
      )}

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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => {
              const isCancelled = (ticket.status || "").toUpperCase() === "CANCELLED";
              const hasReservationId = !!ticket.reservationId;

              return (
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

                  <td>{ticket.status || "N/A"}</td>

                  <td>
                    {!isCancelled ? (
                      <button
                        className="btn-primary"
                        onClick={() => openCancelPopup(ticket)}
                        disabled={!hasReservationId}
                        title={!hasReservationId ? "Missing reservationId" : "Cancel reservation"}
                        style={{ padding: "6px 10px", cursor: hasReservationId ? "pointer" : "not-allowed" }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn-secondary"
                        disabled
                        style={{ padding: "6px 10px", opacity: 0.6 }}
                        title="Already cancelled"
                      >
                        Cancelled
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCancelPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cancel reservation</h3>

            <p>
              Are you sure you want to cancel this reservation?
              <br />
              <strong>Reservation ID:</strong> {ticketToCancel?.reservationId}
              <br />
              <strong>Ticket ID:</strong> {ticketToCancel?.id}
            </p>

            {cancelError && (
              <p className="error-text" style={{ marginTop: 8 }}>
                {cancelError}
              </p>
            )}

            <div className="modal-actions">
              <button className="save-btn" onClick={confirmCancelReservation} disabled={isCancelling}>
                {isCancelling ? "Cancelling..." : "Yes, cancel"}
              </button>

              <button className="cancel-btn" onClick={closeCancelPopup} disabled={isCancelling}>
                No, keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TicketsPage;
