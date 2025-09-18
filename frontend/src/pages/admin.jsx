import React, { useEffect, useState } from 'react';
import apiFetch from '../api';
import { useNavigate } from 'react-router-dom';

export default function Admin({ user }) {
  const [pending, setPending] = useState([]);
  const [msg, setMsg] = useState('');
  const nav = useNavigate();
  useEffect(()=> {
    if (!user || user.role !== 'admin') return;
    async function load() {
      try {
        const p = await apiFetch('/admin/jobs/pending');
        setPending(p);
      } catch (e) { console.error(e); }
    }
    load();
  }, [user]);

  if (!user) return <div className="container">Please login</div>;
  if (user.role !== 'admin') return <div className="container">Admins only</div>;

  async function approve(id) {
    try {
      await apiFetch(`/admin/jobs/${id}/approve`, { method: 'POST' });
      setMsg('Job approved');
      setPending(p => p.filter(x => x.id !== id));
    } catch (e) { setMsg(e.error || 'Error'); }
  }
  async function reject(id) {
    try {
      await apiFetch(`/admin/jobs/${id}/reject`, { method: 'POST' });
      setMsg('Job rejected');
      setPending(p => p.filter(x => x.id !== id));
    } catch (e) { setMsg(e.error || 'Error'); }
  }

  return (
    <div className="container">
      <h3>Admin — Pending Jobs</h3>
      {msg && <div>{msg}</div>}
      {pending.length === 0 && <div>No pending jobs</div>}
      {pending.map(j => (
        <div key={j.id} className="job">
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <strong>{j.title}</strong>
            <span className="small">{j.posted_by_name}</span>
          </div>
          <div className="small">Company: {j.company}</div>
          <p>{j.description}</p>
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={()=>approve(j.id)}>Approve</button>
            <button className="btn" onClick={()=>reject(j.id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
