import React from 'react';
import ReactDOM from 'react-dom/client';
import '../css/app.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">TATS by TATS</h1>
        <p className="text-xl text-gray-400">Affiliate & Loyalty Program</p>
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <p className="text-green-400">✓ Laravel Project Setup Complete</p>
          <p className="text-green-400">✓ Tailwind CSS Installed</p>
          <p className="text-green-400">✓ React + Vite Configured</p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);