import axios from 'axios';
export const API = axios.create({ baseURL: 'http://localhost:5001/api' });
export const fetchStudents=()=>API.get('/students');
export const fetchStudentById=(id)=>API.get(`/students/${id}`)
export const fetchSubmissionsById=(id)=>API.get(`/students/${id}/submissions`)
export const addStudent=(formData)=>API.post('/students',formData);
export const updateStudent=(id,updateData)=>API.put(`/students/${id}`,updateData);
export const deleteStudent=(id)=>API.delete(`/students/${id}`);
export const syncCodeforces=(id)=>API.post(`/students/${id}/sync-codeforces`);
export const updateCronFrequency=(frequency)=>API.post('/cron/update-cron',{frequency});
export const fetchCronExpression = () => API.get('/cron/current-cron'); 
export const updateToggleReminder=(id,enabled)=>API.put(`/students/${id}/reminder`,{enabled})