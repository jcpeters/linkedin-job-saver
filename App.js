import React, { useEffect, useState } from 'react';

function App() {
  const [schedules, setSchedules] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/schedules')
      .then(res => res.json())
      .then(data => setSchedules(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, end })
    });
    const data = await res.json();
    if (res.status === 201) {
      setSchedules([...schedules, data]);
      setStart('');
      setEnd('');
      setMessage('Schedule added!');
    } else {
      setMessage(data.error || 'Error');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial' }}>
      <h2>Schedules</h2>
      <ul>
        {schedules.map(s => (
          <li key={s.id}>
            {s.start} - {s.end}
          </li>
        ))}
      </ul>
      <h3>Add Schedule</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start: <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} required /></label>
        </div>
        <div>
          <label>End: <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} required /></label>
        </div>
        <button type="submit">Add</button>
      </form>
      {message && <div style={{ color: message === 'Schedule added!' ? 'green' : 'red', marginTop: 10 }}>{message}</div>}
    </div>
  );
}

export default App;
