import { fetchStudents, deleteStudent, updateStudent } from "../services/api";
import { useEffect, useState } from "react";
import AddStudents from './AddStudentForm';
import { downloadCSV } from "../utils/csvDownloader";
import { Link } from 'react-router-dom';
import CronUpdater from "./CronUpdater";
import { updateToggleReminder } from "../services/api";
const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const getStudents = async () => {
      try {
        console.log("Is it getting hit");
        const res = await fetchStudents();
        console.log()
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };
    getStudents();
  }, []);

  const handleToggleReminder = async (id, currentValue) => {
  try {
    const res = await updateToggleReminder(id, !currentValue);
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, reminder: { ...s.reminder, enabled: !currentValue } } : s
      )
    );
  } catch (err) {
    console.error("Failed to toggle reminder:", err);
  }
};


  const handleAdd = (newStudent) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } catch (err) {
        console.log("Error deleting this student", err);
      }
    }
  };

  const handleEdit = (id) => {
    setEditId(id);
    const selected = students.find((s) => s._id === id);
    setEditForm({ ...selected });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSave = async (id) => {
    try {
      const res = await updateStudent(id, editForm);
      setStudents((prev) => prev.map((s) => (s._id === id ? res.data : s)));
      setEditId(null);
    } catch (err) {
      console.log("Error in editing form");
    }
  };

  const csvStudents = students.map((student) => ({
    name: student.name,
    email: student.email,
    phone: student.phone,
    codeforcesHandle: student.codeforcesHandle,
    currentRating: student.currentRating,
    maxRating: student.maxRating,
  }));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button
          onClick={() => downloadCSV(csvStudents)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          ⬇️ Download CSV
        </button>
        <CronUpdater />
        <AddStudents onAdd={handleAdd} />
      </div>

      <h2 className="text-xl font-semibold mb-4">📋 Students List</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Handle</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Max</th>
              <th className="px-4 py-3">Last Synced</th>
              <th className="px-4 py-3">Actions</th>
              <th className="px-4 py-3">📧 Reminders</th>
              <th>Toggle Reminder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                {editId === s._id ? (
                  <>
                    <td className="px-4 py-2">
                      <input value={editForm.name} name="name" onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={editForm.email} name="email" onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={editForm.phone} name="phone" onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={editForm.codeforcesHandle} name="codeforcesHandle" onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={editForm.currentRating} name="currentRating" onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={editForm.maxRating} name="maxRating" onChange={handleEditChange} className="border p-1 w-full" />
                    </td>
                    <td className="px-4 py-2" colSpan={3}>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSave(s._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                        <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2">{s.phone}</td>
                    <td className="px-4 py-2">{s.codeforcesHandle}</td>
                    <td className="px-4 py-2">{s.currentRating}</td>
                    <td className="px-4 py-2">{s.maxRating}</td>
                    <td className="px-4 py-2">{new Date(s.lastSyncedAt).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Link to={`/students/${s._id}`}>
                          <button className="bg-indigo-500 text-white px-2 py-1 rounded">View</button>
                        </Link>
                        <button onClick={() => handleEdit(s._id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                        <button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <p className="text-sm text-gray-700">Sent: <strong>{s.reminder?.count || 0}</strong></p>
                    </td>
                    <td className="px-4 py-2 text-center">
                        <input
                            type="checkbox"
                            checked={s.reminder?.enabled || false}
                            onChange={() => handleToggleReminder(s._id, s.reminder?.enabled || false)}
                            className="w-5 h-5"
                        />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
