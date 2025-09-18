import React, { useEffect, useState } from 'react';
import apiFetch from '../api';

export default function Feed() {
  const [jobs, setJobs] = useState([]);
  useEffect(()=> {
    async function load(){ 
      try { const j = await apiFetch('/jobs'); setJobs(j); } catch(e){ console.error(e); }
    }
    load();
  }, []);
  return (
    <div className="container">
      <h3>Jobs Feed</h3>
      {jobs.length === 0 && <div>No open jobs yet.</div>}
      {jobs.map(j => (
        <div key={j.id} className="job">
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <strong>{j.title}</strong>
            <span className="small">{new Date(j.created_at).toLocaleString()}</span>
          </div>
          <div className="small">Company: {j.company} • Posted by: {j.posted_by_name}</div>
          <p>{j.description}</p>
          {j.apply_link && <a className="link" href={j.apply_link} target="_blank">Apply</a>}
        </div>
      ))}
    </div>
  );
}
