import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudentById } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isAfter } from 'date-fns';
import ProblemStats from './ProblemStats';

function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [contestFilter, setContestFilter] = useState(30);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await fetchStudentById(id);
        console.log("Fetched Student:", res.data);
        setStudent(res.data);
      } catch (err) {
        console.log("Can't fetch student details", err);
      }
    };
    loadStudent();
  }, [id]);

  if (!student) return <div className="text-center mt-10 text-lg">Loading...</div>;

  // Filter contests based on selected days
  const filteredContests = (student.contests || []).filter(c =>
    isAfter(new Date(c.date), subDays(new Date(), contestFilter))
  );

  const chartData = filteredContests.map(c => ({
    name: c.contestName,
    date: format(new Date(c.date), "MMM dd"),
    rating: c.newRating,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{student.name}'s Profile</h2>
          <p className="text-gray-600">Email: {student.email}</p>
          <p className="text-gray-600">Phone: {student.phone}</p>
          <p className="text-gray-600">Codeforces Handle: {student.codeforcesHandle}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">🎯 Contest History</h3>
          <div className="mb-4">
            <label className="mr-2 font-medium">Filter:</label>
            <select
              value={contestFilter}
              onChange={(e) => setContestFilter(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 365 days</option>
            </select>
          </div>

          <h4 className="font-semibold text-gray-700 mb-2">📈 Rating Progress</h4>
          {chartData.length === 0 ? (
            <p className="text-gray-500">No contest data for selected range.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          <h4 className="text-lg font-semibold mt-6 mb-2">📋 Contest Table</h4>
          {filteredContests.length === 0 ? (
            <p className="text-gray-500">No contests to show.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
              <table className="w-full table-auto text-sm text-left text-gray-700 bg-white">
                <thead className="bg-indigo-100 text-gray-800 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 border">Name</th>
                    <th className="px-4 py-3 border">Date</th>
                    <th className="px-4 py-3 border">Rank</th>
                    <th className="px-4 py-3 border">Δ Rating</th>
                    <th className="px-4 py-3 border">Unsolved</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContests.map((c, idx) => (
                    <tr
                      key={c.contestId}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3 border">{c.contestName}</td>
                      <td className="px-4 py-3 border">
                        {format(new Date(c.date), "yyyy-MM-dd")}
                      </td>
                      <td className="px-4 py-3 border">{c.rank}</td>
                      <td className="px-4 py-3 border">
                        {c.newRating - c.oldRating}
                      </td>
                      <td className="px-4 py-3 border">{c.unsolvedProblems}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <hr className="my-6" />
        <h3 className="text-xl font-semibold mb-4">🧠 Problem Solving Stats</h3>
        <ProblemStats id={id} />
      </div>
    </div>
  );
}

export default StudentProfile;
