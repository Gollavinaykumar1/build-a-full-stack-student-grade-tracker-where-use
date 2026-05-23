# LLM Output

=== FILE: src/App.jsx ===
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';
import { FiDelete } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';
import { formatDistance } from 'date-fns';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [averageScore, setAverageScore] = useState(0);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    axios.get(`${BASE_URL}/students`)
    .then(response => {
      setStudents(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  const addStudent = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/students`, data);
      setStudents([...students, response.data]);
      toast.success('Student added successfully!');
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/students/${id}`);
      setStudents(students.filter(student => student.id !== id));
      toast.success('Student deleted successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const calculateAverageScore = (student) => {
    const totalMarks = student.subjects.reduce((acc, subject) => acc + subject.marks, 0);
    const averageScore = totalMarks / student.subjects.length;
    return averageScore;
  };

  const handleEdit = (id) => {
    const student = students.find(student => student.id === id);
    setStudentId(id);
    setStudentName(student.name);
    setSubject(student.subjects[0].subject);
    setMarks(student.subjects[0].marks);
  };

  const handleUpdate = async (data) => {
    try {
      const response = await axios.put(`${BASE_URL}/students/${studentId}`, data);
      setStudents(students.map(student => student.id === studentId ? response.data : student));
      toast.success('Student updated successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <HashRouter>
      <div className="max-w-5xl mx-auto p-4">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Student Grade Tracker</h1>
          <Link to="/add-student" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Student</Link>
        </header>
        <Routes>
          <Route path="/" element={
            <div>
              <h2 className="text-2xl font-bold mb-4">Students</h2>
              <table className="w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Marks</th>
                    <th className="px-4 py-2">Average Score</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.subjects[0].subject}</td>
                      <td className="px-4 py-2">{student.subjects[0].marks}</td>
                      <td className="px-4 py-2">{calculateAverageScore(student).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleEdit(student.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"><FiEdit size={16} /></button>
                        <button onClick={() => deleteStudent(student.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"><FiDelete size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          } />
          <Route path="/add-student" element={
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Student</h2>
              <form onSubmit={handleSubmit(addStudent)}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                  <input type="text" id="name" {...register('name')} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">Subject</label>
                  <input type="text" id="subject" {...register('subject')} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marks">Marks</label>
                  <input type="number" id="marks" {...register('marks')} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Student</button>
              </form>
            </div>
          } />
          <Route path="/edit-student" element={
            <div>
              <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
              <form onSubmit={handleSubmit(handleUpdate)}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                  <input type="text" id="name" value={studentName} {...register('name')} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">Subject</label>
                  <input type="text" id="subject" value={subject} {...register('subject')} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marks">Marks</label>
                  <input type="number" id="marks" value={marks} {...register('marks')} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Student</button>
              </form>
            </div>
          } />
        </Routes>
        <ToastContainer />
      </div>
    </HashRouter>
  );
}

export default App;
=== END ===

=== FILE: src/main.jsx ===
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
=== END ===

=== FILE: src/index.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;
=== END ===

=== FILE: src/api.js ===
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
=== END ===