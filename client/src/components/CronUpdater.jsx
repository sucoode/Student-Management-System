import React, { useState, useEffect } from 'react';
import { updateCronFrequency, fetchCronExpression } from '../services/api';

const CronUpdater = () => {
  const [frequency, setFrequency] = useState('daily');
  const [message, setMessage] = useState('');
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const fetchCurrent = async () => {
      const res = await fetchCronExpression();
      setCurrent(res.data.expression);
    };
    fetchCurrent();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await updateCronFrequency(frequency);
      console.log(res)
      setMessage(`✅ ${res.data.message}`);
      setCurrent(res.data.frequency);
    } catch (err) {
      setMessage('❌ Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 border rounded-md shadow w-full max-w-md">
      <h2 className="text-lg font-bold mb-2">Refresh Codeforces Database</h2>
      <label htmlFor="">Select Sync Frequency</label>
      <select value={frequency} onChange={e => setFrequency(e.target.value)} className="border p-2 rounded w-full mb-3">
        <option value="0 1 * * *">Daily (1 AM)</option>
        <option value="daily">Daily (2 AM)</option>
        <option value="0 3 * * *">Daily (3 AM)</option>
        <option value="0 4 * * *">Daily (4 AM)</option>
        <option value="hourly">Hourly</option>
        <option value="everyMinute">Every Minute</option>
        <option value="*/10 * * * *">Every 10 Minutes</option>
      </select>
      <button onClick={handleSubmit} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        Update Sync Schedule
      </button>
      <p className="mt-2 text-sm text-gray-700">{message}</p>
      <p className="mt-1 text-sm text-gray-500">Current: <code>{current}</code></p>
    </div>
  );
};

export default CronUpdater;
