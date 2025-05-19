import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Payment.css"
const Payment = () => {
  const { movieId } = useParams();
  const [movieTitle, setMovieTitle] = useState('');

  useEffect(() => {
    fetch(`/api/movies/${movieId}`)
      .then(res => res.json())
      .then(data => setMovieTitle(data.title))
      .catch(err => console.error('Failed to fetch movie', err));
  }, [movieId]);

  const handlePay = async () => {
    try {
      const response = await fetch('http://localhost:8089/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 2000,
          movieTitle: "Dune - Part Two"
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Could not redirect to Stripe.');
      }
    } catch (err) {
      console.error('Stripe checkout error', err);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>🎟️ Confirm Your Ticket</h2>
        <p className="movie-label">Movie:</p>
        <h3 className="movie-title">{movieTitle || "Loading..."}</h3>
        <p className="price">Price: <strong>20.00 BAM</strong></p>
        <button onClick={handlePay} className="pay-button">
          Pay with Stripe
        </button>
      </div>
    </div>
  );
};

export default Payment;
