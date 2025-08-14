
import React, { useState } from 'react';

function DataEntry() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [marks, setMarks] = useState(Array(5).fill(''));
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [errors, setErrors] = useState({});

  const divisions = ['First', 'Second', 'Third', 'Fail'];

  function calculatePercentage(marksArray) {
    const total = marksArray.reduce((sum, m) => sum + parseFloat(m || 0), 0);
    return (total / 5).toFixed(2);
  }

  function calculateDivision(perc) {
    if (perc >= 60) return 'First';
    if (perc >= 50) return 'Second';
    if (perc >= 40) return 'Third';
    return 'Fail';
  }

  function validate() {
    let err = {};
    if (!name.trim()) err.name = 'Name is required';
    if (!age || parseInt(age) <= 0) err.age = 'Valid age is required';
    marks.forEach((m, i) => {
      const num = parseFloat(m);
      if (isNaN(num) || num < 0 || num > 100) err[`mark${i}`] = 'Marks must be between 0 and 100';
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const m = marks.map(m => parseFloat(m));
    const perc = calculatePercentage(m);
    const div = calculateDivision(perc);
    const student = { id: editingId || Date.now(), name, age: parseInt(age), marks: m, percentage: perc, division: div };

    if (editingId) {
      setStudents(students.map(s => s.id === editingId ? student : s));
      setEditingId(null);
    } else {
      setStudents([...students, student]);
    }
    resetForm();
  }

  function resetForm() {
    setName('');
    setAge('');
    setMarks(Array(5).fill(''));
    setErrors({});
  }

  function editStudent(id) {
    const s = students.find(s => s.id === id);
    setName(s.name);
    setAge(s.age.toString());
    setMarks(s.marks.map(String));
    setEditingId(id);
  }

  function deleteStudent(id) {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  }

  const filteredStudents = students.filter(s => {
    return s.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterDivision || s.division === filterDivision);
  });

  return (
    <div className=" mx-auto p-4 bg-gray-100 min-h-screen max-w-2xl">

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Student Data Entry</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

         {/*Name*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

         {/*Age*/}
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input 
              type="number" 
              value={age} 
              onChange={e => setAge(e.target.value)} 
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>
          
          {/*Marks*/}
          {marks.map((m, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700">Mark {i + 1}</label>
              <input 
                type="number" 
                value={m} 
                onChange={e => {
                  const newMarks = [...marks];
                  newMarks[i] = e.target.value;
                  setMarks(newMarks);
                }} 
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
              {errors[`mark${i}`] && <p className="mt-1 text-sm text-red-600">{errors[`mark${i}`]}</p>}
            </div>
          ))}
        </div>

        {/*submit*/}
        <button 
          type="submit" 
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer transition duration-200"
        >
          {editingId ? 'Update Student' : 'Add Student'}
        </button>

      </form>
        
     {/*Search & Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input 
          placeholder="Search by Name" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2" 
        />
        <select 
          value={filterDivision} 
          onChange={e => setFilterDivision(e.target.value)} 
          className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
        >
          <option value="">All Divisions</option>
          {divisions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(s => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.age}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.marks.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.percentage}%</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.division}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => editStudent(s.id)} 
                    className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 mr-2 transition duration-200"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteStudent(s.id)} 
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
    </div>
  );
}

export default DataEntry;



