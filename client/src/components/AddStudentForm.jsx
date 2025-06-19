// src/components/AddStudentForm.jsx
import { useState } from 'react';
import { addStudent } from '../services/api';

const AddStudentForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    codeforcesHandle: '',
    currentRating: '',
    maxRating: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addStudent(formData);
      console.log(res)
      onAdd(res.data); // rexfresh table
      setFormData({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: '',
      });
    } catch (err) {
      console.error('Error adding student', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add Student</h3>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
      <input name="codeforcesHandle" placeholder="CF Handle" value={formData.codeforcesHandle} onChange={handleChange} required />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddStudentForm;
