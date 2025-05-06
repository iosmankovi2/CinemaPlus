import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [rezultati, setRezultati] = useState([]);
  const [error, setError] = useState('');
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(`http://localhost:8089/api/search?query=${query}`);
      const data = response.data;

      setRezultati(data);
      setError('');
      setNoResults(data.length === 0);
    } catch (err) {
      console.error('Greška pri pretrazi:', err);
      setError('Greška pri pretrazi. Provjeri server.');
      setRezultati([]);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Pretraži filmove, sale, događaje..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '250px',
          fontSize: '14px'
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          marginLeft: '0.5rem',
          padding: '0.4rem 0.8rem',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: '#222',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Traži
      </button>

      {/* Prikaz rezultata */}
      <div style={{ position: 'absolute', top: '60px', background: '#fff', color: '#000', padding: '0.5rem', borderRadius: '5px' }}>
        {error && <p>{error}</p>}
        {noResults && <p>Nema rezultata za: "{query}"</p>}
        {rezultati.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            {rezultati.map((item, index) => (
              <li key={index}>
                {item.title || item.name || item.naziv}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
