// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
const Header = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // Ovdje dodaj logiku za pretragu (npr. preusmjeravanje na stranicu sa rezultatima, ili pokretanje API poziva)
    console.log("Traži:", query);
  };

  return (
    <header
      style={{
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem'
      }}
    >
      {/* Lijeva strana navigacije */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ marginRight: '2rem' }}>
          🍿 <span style={{ color: 'red' }}>Cinema</span>Plus
        </h1>
        <Link
          to="/sale"
          style={{ marginRight: '1rem', color: '#fff', textDecoration: 'none' }}
        >
          Sale
        </Link>
        <Link
          to="/login"
          style={{ marginRight: '1rem', color: '#fff', textDecoration: 'none' }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{ color: '#fff', textDecoration: 'none' }}
        >
          Register
        </Link>
      </div>

      {/* Desna strana - Search bar */}
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: '400px', width: '100%' }}>
        <input
          type="text"
          placeholder="Pretraži filmove, sale, događaje..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            width: '100%',
            padding: '0.3rem',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '0.3rem 0.6rem',
            marginLeft: '0.5rem',
            backgroundColor: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Traži
        </button>
      </div>
    </header>
  );
};

export default Header;
