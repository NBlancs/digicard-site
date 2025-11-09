import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClipboardOutline, IoCopyOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { supabase } from '../lib/supabase';
import type { Student } from '../types/database';
import './Dashboard.css';

interface EditingStudent {
  id: string;
  full_name: string;
  school_id: string;
  program: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<EditingStudent | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ full_name: '', school_id: '', program: '' });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scanned_students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      showMessage(`Error fetching students: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'success' }), 5000);
  };

  // CREATE
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cardLink = `${window.location.origin}/card/${newStudent.school_id}`;
      
      const { error } = await supabase
        .from('scanned_students')
        .insert({
          full_name: newStudent.full_name,
          school_id: newStudent.school_id,
          program: newStudent.program,
          digital_card_link: cardLink,
        });

      if (error) throw error;

      showMessage('✓ Student added successfully!', 'success');
      setNewStudent({ full_name: '', school_id: '', program: '' });
      setShowAddForm(false);
      fetchStudents();
    } catch (error: any) {
      showMessage(`Error adding student: ${error.message}`, 'error');
    }
  };

  // UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const { error } = await supabase
        .from('scanned_students')
        .update({
          full_name: editingStudent.full_name,
          school_id: editingStudent.school_id,
          program: editingStudent.program,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      showMessage('✓ Student updated successfully!', 'success');
      setEditingStudent(null);
      fetchStudents();
    } catch (error: any) {
      showMessage(`Error updating student: ${error.message}`, 'error');
    }
  };

  // DELETE
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const { error } = await supabase
        .from('scanned_students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showMessage('✓ Student deleted successfully!', 'success');
      fetchStudents();
    } catch (error: any) {
      showMessage(`Error deleting student: ${error.message}`, 'error');
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    showMessage('✓ Card link copied to clipboard!', 'success');
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Student Dashboard</h2>
          <p>Manage scanned student records</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-add">
          {showAddForm ? '✕ Cancel' : '+ Add Student'}
        </button>
      </div>

      {message.text && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* ADD FORM */}
      {showAddForm && (
        <div className="form-card">
          <h3>Add New Student</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  required
                  placeholder="e.g., JOHN SMITH DOE"
                />
              </div>
              <div className="form-group">
                <label>School ID (10 digits)</label>
                <input
                  type="text"
                  value={newStudent.school_id}
                  onChange={(e) => setNewStudent({ ...newStudent, school_id: e.target.value })}
                  required
                  pattern="\d{10}"
                  placeholder="e.g., 2024300617"
                />
              </div>
              <div className="form-group">
                <label>Program</label>
                <input
                  type="text"
                  value={newStudent.program}
                  onChange={(e) => setNewStudent({ ...newStudent, program: e.target.value })}
                  required
                  placeholder="e.g., BSIT"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Student</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT FORM */}
      {editingStudent && (
        <div className="form-card">
          <h3>Edit Student</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingStudent.full_name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>School ID</label>
                <input
                  type="text"
                  value={editingStudent.school_id}
                  onChange={(e) => setEditingStudent({ ...editingStudent, school_id: e.target.value })}
                  required
                  pattern="\d{10}"
                />
              </div>
              <div className="form-group">
                <label>Program</label>
                <input
                  type="text"
                  value={editingStudent.program}
                  onChange={(e) => setEditingStudent({ ...editingStudent, program: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Update Student</button>
              <button type="button" onClick={() => setEditingStudent(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="table-container">
        {students.length === 0 ? (
          <div className="empty-state">
            <IoClipboardOutline className="empty-icon" />
            <h3>No Students Found</h3>
            <p>Start scanning QR codes or add students manually</p>
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Digital Card</th>
                <th>Full Name</th>
                <th>School ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="card-link-cell">
                      <button
                        onClick={() => navigate(`/card/${student.school_id}`)}
                        className="link-button"
                      >
                        View Card
                      </button>
                      <button 
                        onClick={() => copyLink(student.digital_card_link)}
                        className="copy-button"
                        title="Copy link"
                      >
                        <IoCopyOutline />
                      </button>
                    </div>
                  </td>
                  <td>{student.full_name}</td>
                  <td>{student.school_id}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => setEditingStudent({
                          id: student.id,
                          full_name: student.full_name,
                          school_id: student.school_id,
                          program: student.program,
                        })}
                        className="btn-icon-action edit"
                        title="Edit"
                      >
                        <IoCreateOutline />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.full_name)}
                        className="btn-icon-action delete"
                        title="Delete"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {students.length > studentsPerPage && (
        <div className="pagination">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      <div className="dashboard-footer">
        <p>
          Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, students.length)} of <strong>{students.length}</strong> students
          {totalPages > 1 && <span> • Page {currentPage} of {totalPages}</span>}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
