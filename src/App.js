import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import About from './components/About';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Footer from './components/Footer'; // Import Footer component
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        </Routes>
        <Footer /> {/* Footer will appear at the bottom of every page */}
      </div>
    </Router>
  );
}

export default App;