import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        {/* For now, just a simple heading to see if it works */}
        <h1 style={{ textAlign: 'center', color: '#FF4D4D' }}>
          Welcome to Ramtek Bazar
        </h1>
        
        <Routes>
          {/* We will add our Home and Sell routes here in the next step */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;