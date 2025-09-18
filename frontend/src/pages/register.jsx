import React, { useState } from 'react';
import apiFetch from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const nav = useNavigate();
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      nav('/');
    } catch (e) {
      setErr(e.error || 'Register failed');
    }
  }

  return (
    <div className="container">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="College email" />
        <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <div>
          <label className="small">Role: </label>
          <select value={role} onChange={e=>setRole(e.target.value)} className="input">
            <option value="student">Student</option>
            <option value="alumni">Alumni / Placed</option>
          </select>
        </div>
        <button className="btn" type="submit">Register</button>
      </form>
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  );
}
