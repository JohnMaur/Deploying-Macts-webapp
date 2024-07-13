import React, { useState, useEffect } from 'react';
import { Modal, Input, Spin, Alert, message } from 'antd';
import axios from 'axios';

const AttendanceModal = ({ visible, onClose, onSubmit }) => {
  const [tuptId, setTuptId] = useState('');
  const [attendanceCode, setAttendanceCode] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTuptIdChange = async (e) => {
    const value = e.target.value;
    setTuptId(value);
    
    if (value) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://macts-backend-webapp-production-0bd2.up.railway.app/getAttendanceCode/studentinfo/${value}`);
        setStudentInfo(response.data);
      } catch (err) {
        setError('Error fetching student info.');
        setStudentInfo(null);
      } finally {
        setLoading(false);
      }
    } else {
      setStudentInfo(null);
    }
  };

  const handleAttendanceCodeChange = (e) => setAttendanceCode(e.target.value);

  const handleOk = () => {
    onSubmit({ tuptId, attendanceCode });
    setTuptId('');
    setAttendanceCode('');
    setStudentInfo(null);
    onClose();
  };

  const handleCancel = () => {
    setTuptId('');
    setAttendanceCode('');
    setStudentInfo(null);
    onClose();
  };

  return (
    <Modal
      title="Update Attendance"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      zIndex={10000}
    >
      <Input
        placeholder="TUPT ID"
        value={tuptId}
        onChange={handleTuptIdChange}
      />
      {loading && <Spin style={{ marginTop: 10 }} />}
      {error && <Alert type="error" message={error} style={{ marginTop: 10 }} />}
      {studentInfo && (
        <div style={{ marginTop: 10 }}>
          <p>First Name: {studentInfo.studentInfo_first_name}</p>
          <p>Middle Name: {studentInfo.studentInfo_middle_name}</p>
          <p>Last Name: {studentInfo.studentInfo_last_name}</p>
          <p>TUPT ID: {studentInfo.studentInfo_tuptId}</p>
          <p>Course: {studentInfo.studentInfo_course}</p>
          <p>Section: {studentInfo.studentInfo_section}</p>
        </div>
      )}
      <Input
        placeholder="Attendance Code"
        value={attendanceCode}
        onChange={handleAttendanceCodeChange}
        style={{ marginTop: 10 }}
      />
    </Modal>
  );
};

export default AttendanceModal;
