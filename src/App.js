import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Add 'Navigate'
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ItemList from './components/ItemList'; // Importing ItemList
import ItemDetails from './components/ItemDetails';
import About from './components/About';
import Login from './components/Login';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import QualityCheck from './components/QualityCheck'; // New component
import Reports from './components/Reports'; // New component
import Notifications from './components/Notifications'; // New component
import ApprovalDashboard from './components/ApprovalDashboard'; // New component
import Settings from './components/Settings'; // New component
import Contact from './components/Contact'; // Import Contact component
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ loggedIn, children }) => {
  return loggedIn ? children : <Navigate to="/login" />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // State for login

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />

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
            path="/quality-check"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <QualityCheck />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approval-dashboard"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <ApprovalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Settings />
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