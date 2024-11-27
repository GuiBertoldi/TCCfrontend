import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BarSide from './components/barside';
import Login from './components/login';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/sidebar">BarSide</Link> | <Link to="/login">Login</Link>
        </nav>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Bem-vindo ao Vite + React</h1>
              <p>Esta é a página inicial. Use o menu acima para navegar.</p>
            </div>
          }
        />
        <Route path="/sidebar" element={<BarSide />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
