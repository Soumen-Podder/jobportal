import React, { useState } from 'react';
import apiFetch from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      nav('/');
    } catch (e) {
      setErr(e.error || 'Login failed');
    }
  }

  return (
    <div className="container">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <button className="btn" type="submit">Login</button>
      </form>
      {err && <div style={{color:'red'}}>{err}</div>}
      <div className="small">Default admin: admin@college.edu / adminpass</div>
    </div>
  );
}
