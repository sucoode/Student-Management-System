import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSubmissionsById } from '../services/api';
import RatingBarChart from './RatingBarChart';
import Heatmap from './Heatmap';

function ProblemStats() {
  const { id } = useParams(); // Assuming studentId is from URL
  const [submissions, setSubmissions] = useState([]);
  const [days, setDays] = useState(30); // Default filter

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSubmissionsById(id); // Fetch from backend
        setSubmissions(res.data);
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      }
    };
    load();
  }, [id]);

  const filtered = useMemo(() => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    return submissions.filter(s => new Date(s.date) >= fromDate);
  }, [submissions, days]);

  const total = filtered.length;
  const avgProblemsPerDay = (total / days).toFixed(2);
  const avgRating = (filtered.reduce((acc, curr) => acc + curr.rating, 0) / total || 0).toFixed(0);
  const mostDifficult = filtered.reduce((a, b) => (a.rating > b.rating ? a : b), {});

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="font-semibold">Filter: </label>
        {[7, 30, 90].map(n => (
          <button
            key={n}
            className={`mx-2 px-3 py-1 rounded ${
              days === n ? 'bg-blue-500 text-white' : 'bg-blue-100 text-black'
            }`}
            onClick={() => setDays(n)}
          >
            Last {n} days
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-lg">
        <div>Most difficult problem solved: <strong>{mostDifficult.rating || 'N/A'}</strong></div>
        <div>AVG Rating: <strong>{avgRating}</strong></div>
        <div>AVG Problems/day: <strong>{avgProblemsPerDay}</strong></div>
        <div>Total Solved: <strong>{total}</strong></div>
      </div>

      <h2 className="text-xl font-semibold mt-4 mb-2">Bar Chart: Problems per Rating</h2>
      <RatingBarChart data={filtered} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Submission Heatmap</h2>
      <Heatmap data={filtered} />
    </div>
  );
}

export default ProblemStats;
