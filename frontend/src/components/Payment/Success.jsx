import React from 'react';
import './PaymentResult.css';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const Success = () => {
  return (
    <div className="result-container success">
      <FaCheckCircle className="icon" />
      <h2>Payment Successful!</h2>
      <p>Your ticket has been booked. Thank you for your purchase! 🎉</p>
      <Link to="/" className="back-home">Back to Home</Link>
    </div>
  );
};

export default Success;
