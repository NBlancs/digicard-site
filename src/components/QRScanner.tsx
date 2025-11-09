import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../lib/supabase';
import type { StudentInsert } from '../types/database';
import './QRScanner.css';

interface ExtractedData {
  fullName: string;
  schoolId: string;
  program: string;
}

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({ text: '', type: 'info' });
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  // Extract student data from QR code text
  const extractStudentData = (text: string): ExtractedData | null => {
    try {
      // Example input: "NOEL JHUMEL G. BLANCO 2024300617 BSIT"
      // Pattern: Extract name (everything before 10-digit ID), 10-digit school ID, and program (after ID)
      const regex = /^(.+?)\s+(\d{10})\s+([A-Z]+)$/;
      const match = text.trim().match(regex);

      if (match) {
        return {
          fullName: match[1].trim(),
          schoolId: match[2],
          program: match[3].trim(),
        };
      }

      // Alternative pattern: Try more flexible matching
      const altRegex = /^(.+?)\s+(\d{10})\s*(.*)$/;
      const altMatch = text.trim().match(altRegex);

      if (altMatch && altMatch[3]) {
        return {
          fullName: altMatch[1].trim(),
          schoolId: altMatch[2],
          program: altMatch[3].trim(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error extracting data:', error);
      return null;
    }
  };

  // Save student to Supabase
  const saveStudent = async (data: ExtractedData) => {
    try {
      // Generate unique digital card link
      const cardLink = `${window.location.origin}/card/${data.schoolId}`;

      const studentData: StudentInsert = {
        full_name: data.fullName,
        school_id: data.schoolId,
        program: data.program,
        digital_card_link: cardLink,
      };

      const { error } = await (supabase
        .from('scanned_students')
        .upsert([studentData], { onConflict: 'school_id' }) as any);

      if (error) throw error;

      setMessage({ text: `✓ Student saved successfully! Card link: ${cardLink}`, type: 'success' });
      return true;
    } catch (error: any) {
      setMessage({ text: `Error saving student: ${error.message}`, type: 'error' });
      return false;
    }
  };

  // Start scanning
  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanner after successful scan
          await stopScanning();

          // Extract data
          const extracted = extractStudentData(decodedText);
          
          if (extracted) {
            setExtractedData(extracted);
            setMessage({ text: 'QR code scanned successfully! Review data below.', type: 'success' });
          } else {
            setMessage({ 
              text: 'Could not extract student data. Please ensure QR code format is: "NAME SCHOOLID PROGRAM"', 
              type: 'error' 
            });
          }
        },
        () => {
          // Silent - just scanning for QR codes
        }
      );

      setScanning(true);
      setMessage({ text: 'Camera active. Position QR code in the frame.', type: 'info' });
    } catch (error: any) {
      setMessage({ text: `Failed to start camera: ${error.message}`, type: 'error' });
    }
  };

  // Stop scanning
  const stopScanning = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  // Handle save button
  const handleSave = async () => {
    if (extractedData) {
      const success = await saveStudent(extractedData);
      if (success) {
        // Reset after successful save
        setTimeout(() => {
          setExtractedData(null);
          setMessage({ text: '', type: 'info' });
        }, 3000);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <h2>QR Code Scanner</h2>
        <p>Scan student ID QR codes to register members</p>
      </div>

      <div className="scanner-content">
        <div id="qr-reader" className="qr-reader" ref={scannerDivRef}></div>

        <div className="scanner-controls">
          {!scanning && !extractedData && (
            <button onClick={startScanning} className="btn btn-primary">
              <span className="btn-icon">📷</span>
              Start Scanner
            </button>
          )}

          {scanning && (
            <button onClick={stopScanning} className="btn btn-danger">
              <span className="btn-icon">⏹</span>
              Stop Scanner
            </button>
          )}
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        {extractedData && (
          <div className="extracted-data">
            <h3>Extracted Data</h3>
            <div className="data-fields">
              <div className="data-field">
                <label>Full Name:</label>
                <span>{extractedData.fullName}</span>
              </div>
              <div className="data-field">
                <label>School ID:</label>
                <span>{extractedData.schoolId}</span>
              </div>
              <div className="data-field">
                <label>Program:</label>
                <span>{extractedData.program}</span>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={handleSave} className="btn btn-success">
                <span className="btn-icon">💾</span>
                Save to Database
              </button>
              <button 
                onClick={() => {
                  setExtractedData(null);
                  setMessage({ text: '', type: 'info' });
                }} 
                className="btn btn-secondary"
              >
                <span className="btn-icon">❌</span>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
