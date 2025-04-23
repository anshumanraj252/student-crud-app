import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = "http://localhost:5000/students";

const App = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editId, setEditId] = useState(null); // to store student ID when editing
  
    useEffect(() => {
        fetchStudents();
      }, []);
    
      const fetchStudents = async () => {
        try {
          const res = await axios.get(API_URL);
          setStudents(res.data);
        } catch (err) {
          console.error("Error fetching students:", err);
        }
      };
  
    const handleAddOrUpdate = async () => {
      const nameRegex = /^[A-Za-z\s]+$/;
      const mobileRegex = /^[0-9]{10}$/;
  
      if (!nameRegex.test(name.trim())) {
        alert("Please enter a valid name.");
        return;
      }
  
      if (!mobileRegex.test(mobile.trim())) {
        alert("Please enter a valid mobile number.");
        return;
      }
  
      const newStudent = { name, mobile };
  
      if (editId !== null) {
        await axios.put(`${API_URL}/${editId}`, newStudent);
      } else {
        await axios.post(API_URL, newStudent);
      }
  
      const res = await axios.get(API_URL);
      setStudents(res.data);
      setName('');
      setMobile('');
      setEditIndex(null);
      setEditId(null);
    };
  
    const handleEdit = (index) => {
      setName(students[index].name);
      setMobile(students[index].mobile);
      setEditIndex(index);
      setEditId(students[index].id); // get ID from API response
    };
  
    const handleDelete = async (index) => {
      const id = students[index].id;
      await axios.delete(`${API_URL}/${id}`);
      const res = await axios.get(API_URL);
      setStudents(res.data);
      setEditIndex(null);
      setEditId(null);
    };

  return (
    
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="glass-card w-100" style={{ maxWidth: '900px' }}>
        <h1 className="text-center mb-4">
          📚 <span style={{ fontWeight: 'bold' }}>Student CRUD App</span>
        </h1>
        
        <div className="row justify-content-center mb-4">
          <div className="col-md-4">
            <input
                id="name"
                type="text"
                placeholder="Student Name"
                className="form-control mb-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              id="mobile"
              type="text"
              className="form-control mb-2"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className={`btn ${editIndex !== null ? 'btn-warning' : 'btn-primary'} w-100`}
              onClick={handleAddOrUpdate}
              
            >
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
  
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-light py-3">
                  No students added yet.
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.mobile}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default App;
