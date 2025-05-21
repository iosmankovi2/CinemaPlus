import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../axios';
import "./Payment.css";

const Payment = () => {
  const { movieId } = useParams();
  const [movieTitle, setMovieTitle] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${movieId}`);
        setMovieTitle(res.data.title);
      } catch (err) {
        console.error('Failed to fetch movie', err);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handlePay = async () => {
    try {
      const response = await api.post('/payment/create-checkout-session', {
        amount: 2000,
        movieTitle: movieTitle || 'Untitled Movie'
      });

      if (response.data.url) {
        window.location.href = response.data.url;
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