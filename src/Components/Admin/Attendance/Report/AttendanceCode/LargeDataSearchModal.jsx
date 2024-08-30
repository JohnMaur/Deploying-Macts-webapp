import React, { useState } from 'react';
import { Modal, Input, Button, List, Spin, Alert } from 'antd';
import axios from 'axios';

const LargeDataSearchModal = ({ visible, onClose, onSubmit }) => {
  const [section, setSection] = useState('');
  const [attendanceCode, setAttendanceCode] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSectionChange = async (e) => {
    const value = e.target.value;
    setSection(value);

    if (value) {
      setLoading(true);
      setError(null);

      try {
        // const response = await axios.get(`https://macts-backend-webapp-production-0bd2.up.railway.app/getStudentsBySection/${value}`);
        const response = await axios.get(`https://macts-backend-webapp.onrender.com/getStudentsBySection/${value}`);
        const sortedStudents = response.data.sort((a, b) =>
          a.studentInfo_last_name.localeCompare(b.studentInfo_last_name)
        );
        setStudents(sortedStudents);
      } catch (err) {
        setError('Error fetching students.');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    } else {
      setStudents([]);
    }
  };

  const handleAttendanceCodeChange = (e) => setAttendanceCode(e.target.value);

  const handleOk = () => {
    onSubmit({ section, attendanceCode });
    setSection('');
    setAttendanceCode('');
    setStudents([]);
    onClose();
  };

  const handleCancel = () => {
    setSection('');
    setAttendanceCode('');
    setStudents([]);
    onClose();
  };

  return (
    <Modal
      title="Large Data Search"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      zIndex={10000}
    >
      <Input
        placeholder="Section"
        value={section}
        onChange={handleSectionChange}
      />
      {loading && <Spin style={{ marginTop: 10 }} />}
      {error && <Alert type="error" message={error} style={{ marginTop: 10 }} />}
      <List
        bordered
        dataSource={students}
        renderItem={(student, index) => (
          <List.Item>
            <span style={{ fontWeight: 'bold' }}>{index + 1}. </span>
            {student.studentInfo_last_name}, {student.studentInfo_first_name} {student.studentInfo_middle_name} - {student.studentInfo_course} - {student.studentInfo_section}
          </List.Item>
        )}
        style={{ marginTop: 10 }}
      />
      <Input
        placeholder="Attendance Code"
        value={attendanceCode}
        onChange={handleAttendanceCodeChange}
        style={{ marginTop: 10 }}
      />
    </Modal>
  );
};

export default LargeDataSearchModal;
