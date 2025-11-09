import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import type { Student } from '../types/database';
import './DigitalCard.css';

const DigitalCard: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schoolId) {
      fetchStudent(schoolId);
    }
  }, [schoolId]);

  const fetchStudent = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scanned_students')
        .select('*')
        .eq('school_id', id)
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (err: any) {
      setError(err.message || 'Student not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-page">
        <div className="loading-card">Loading digital card...</div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="card-page">
        <div className="error-card">
          <span className="error-icon">❌</span>
          <h2>Card Not Found</h2>
          <p>{error || 'This digital membership card does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-page">
      <div className="digital-card">
        {/* Header */}
        <div className="card-header">
          <div className="club-logo">
            <div className="logo-circle">
              <span className="logo-text">SC</span>
            </div>
          </div>
          <div className="club-info">
            <h1 className="club-name">Student Club</h1>
            <p className="club-tagline">Digital Membership</p>
          </div>
          <div className="status-badge active">
            <span className="status-dot"></span>
            Active
          </div>
        </div>

        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-placeholder">
            <span className="avatar-icon">👤</span>
          </div>
        </div>

        {/* Member Information */}
        <div className="member-info">
          <div className="info-field">
            <label>MEMBER'S NAME</label>
            <p className="info-value">{student.full_name}</p>
          </div>

          <div className="info-field">
            <label>MEMBERSHIP ID</label>
            <p className="info-value">{student.school_id}</p>
          </div>

          <div className="info-field">
            <label>PROGRAM</label>
            <p className="info-value">{student.program}</p>
          </div>

          <div className="info-field">
            <label>EXPIRATION DATE</label>
            <p className="info-value">December 31, 2025</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="qr-section">
          <div className="qr-container">
            <QRCodeSVG
              value={student.digital_card_link}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="qr-label">Scan for verification</p>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <p className="footer-text">This is an official digital membership card</p>
          <p className="footer-date">Issued: {new Date(student.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Download/Share Buttons */}
      <div className="card-actions">
        <button 
          onClick={() => window.print()} 
          className="action-btn print-btn"
        >
          🖨️ Print Card
        </button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Card link copied to clipboard!');
          }}
          className="action-btn share-btn"
        >
          🔗 Share Link
        </button>
      </div>
    </div>
  );
};

export default DigitalCard;
