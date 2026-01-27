import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ItemList from './components/ItemList';
import ItemDetails from './components/ItemDetails';
import SearchResult from './components/SearchResult';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Contact from './components/Contact';
import DeleteMedicine from './components/DeleteMedicine';
import UpdateMedicine from './components/UpdateMedicine';
import QualityScoreDashboard from './components/QualityScoreDashboard';
import AcceptanceStatsDashboard from './components/AcceptanceStatsDashboard';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './App.css';
import Chatbot from './components/Chatbot';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if token exists on initial load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setLoggedIn(true);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <NavBar setLoggedIn={setLoggedIn} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} />} />

            {/* Chatbot Route (public) */}
            <Route path="/chatbot" element={<Chatbot />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <ItemList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <ItemDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-result"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <SearchResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-medicine"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <DeleteMedicine />
              </ProtectedRoute>
            }
          />
           <Route
            path="/update-medicine"
            element={loggedIn ? <UpdateMedicine /> : <Navigate to="/login" />}
          />
          <Route
            path="/quality-scores"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <QualityScoreDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acceptance-stats"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <AcceptanceStatsDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;