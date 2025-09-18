import React, { useState } from 'react';
import apiFetch from '../api';
import { useNavigate } from 'react-router-dom';

export default function PostJob({ user }) {
  const nav = useNavigate();
  const [title,setTitle]=useState('');
  const [company,setCompany]=useState('');
  const [description,setDescription]=useState('');
  const [apply,setApply]=useState('');
  const [msg,setMsg]=useState('');

  if (!user) return <div className="container">Please login</div>;
  if (user.role !== 'alumni' && user.role !== 'admin') return <div className="container">Only alumni can post jobs</div>;

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await apiFetch('/jobs', {
        method: 'POST',
        body: JSON.stringify({ title, company, description, apply_link: apply })
      });
      setMsg(`Created (status: ${res.status}). Admin will approve if pending.`);
      setTimeout(()=>nav('/'),1200);
    } catch (e) {
      setMsg(e.error || 'Error');
    }
  }

  return (
    <div className="container">
      <h3>Post Job</h3>
      <form onSubmit={submit}>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Job title" />
        <input className="input" value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company" />
        <textarea className="input" rows="6" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description & requirements" />
        <input className="input" value={apply} onChange={e=>setApply(e.target.value)} placeholder="Apply link or email" />
        <button className="btn" type="submit">Submit</button>
      </form>
      {msg && <div style={{marginTop:10}}>{msg}</div>}
    </div>
  );
}
