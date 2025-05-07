import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // ako imaš globalne stilove

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
