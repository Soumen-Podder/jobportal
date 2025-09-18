import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import PostJob from './pages/PostJob';
import Admin from './pages/Admin';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }
  return (
    <div className="header container">
      <div><strong>College Jobs Portal</strong></div>
      <div className="nav">
        <Link to="/">Feed</Link>
        {user && user.role === 'alumni' && <Link to="/post">Post Job</Link>}
        {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <span className="small">Hi, {user.name} ({user.role})</span>}
        {user && <button className="btn" onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      const u = JSON.parse(localStorage.getItem('user'));
      setUser(u);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/post" element={<PostJob user={user} />} />
        <Route path="/admin" element={<Admin user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
