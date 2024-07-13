import React, { useState } from 'react';
import { Button, message, Modal, List } from 'antd';
import AttendanceModal from './AttendanceCodeModal';
import LargeDataSearchModal from './LargeDataSearchModal';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AttendanceCodeSolo = () => {
  const { attendance_code } = useParams();
  const attendanceCode = attendance_code;

  const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false);
  const [isLargeDataSearchModalVisible, setIsLargeDataSearchModalVisible] = useState(false);
  const [isAttendanceListModalVisible, setIsAttendanceListModalVisible] = useState(false);
  const [studentsWithAttendanceCode, setStudentsWithAttendanceCode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const showAttendanceModal = () => {
    setIsAttendanceModalVisible(true);
  };

  const showLargeDataSearchModal = () => {
    setIsLargeDataSearchModalVisible(true);
  };

  const showAttendanceListModal = async () => {
    setIsAttendanceListModalVisible(true);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://macts-backend-webapp-production-0bd2.up.railway.app/studentsByAttendanceCode/${attendanceCode}`);
      setStudentsWithAttendanceCode(response.data);
    } catch (error) {
      setError('Error fetching students with attendance code.');
      console.error('Error fetching students with attendance code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceModalClose = () => {
    setIsAttendanceModalVisible(false);
  };

  const handleLargeDataSearchModalClose = () => {
    setIsLargeDataSearchModalVisible(false);
  };

  const handleAttendanceListModalClose = () => {
    setIsAttendanceListModalVisible(false);
    setStudentsWithAttendanceCode([]);
  };

  const handleAttendanceFormSubmit = async ({ tuptId, attendanceCode }) => {
    try {
      await axios.post(`https://macts-backend-webapp-production-0bd2.up.railway.app/attendanceCode/studentinfo/${tuptId}`, {
        attendance_code: attendanceCode,
      });
      message.success('Attendance code updated successfully');
    } catch (error) {
      console.error('Error updating attendance code:', error);
      message.error('Error updating attendance code');
    }
  };

  const handleLargeDataSearchFormSubmit = async ({ section, attendanceCode }) => {
    try {
      await axios.post(`https://macts-backend-webapp-production-0bd2.up.railway.app/updateAttendanceCodeBySection`, {
        section,
        attendance_code: attendanceCode,
      });
      message.success('Attendance codes updated successfully');
    } catch (error) {
      console.error('Error updating attendance codes:', error);
      message.error('Error updating attendance codes');
    }
  };

  return (
    <div className='z-[10000] flex justify-between space-x-5 py-5'>
      <div className='shadow-md p-5 rounded-md w-1/3'>
        <p className='my-2'>Adding students (Individual)</p>
        <Button className='font-bold' type="primary" onClick={showAttendanceModal}>
          ADD
        </Button>
      </div>

      <div className='shadow-md p-5 rounded-md w-1/3'>
        <p className='my-2'>Adding students (By Section)</p>
        <Button className='font-bold' type="primary" onClick={showLargeDataSearchModal}>
          ADD
        </Button>
      </div>

      <AttendanceModal
        visible={isAttendanceModalVisible}
        onClose={handleAttendanceModalClose}
        onSubmit={handleAttendanceFormSubmit}
      />
      <LargeDataSearchModal
        visible={isLargeDataSearchModalVisible}
        onClose={handleLargeDataSearchModalClose}
        onSubmit={handleLargeDataSearchFormSubmit}
      />

      <Modal
        title={`Students with Attendance Code ${attendanceCode}`}
        visible={isAttendanceListModalVisible}
        onCancel={handleAttendanceListModalClose}
        footer={null}
        width={600}
        zIndex={10000}
      >
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <List
          bordered
          dataSource={studentsWithAttendanceCode}
          renderItem={(student, index) => (
            <List.Item>
              <span style={{ fontWeight: 'bold' }}>No. {index + 1}: </span>
              {student.studentInfo_last_name}, {student.studentInfo_first_name} {student.studentInfo_middle_name} - {student.studentInfo_course} - {student.studentInfo_section}
            </List.Item>
          )}
        />
      </Modal>

      <div className='shadow-md p-5 rounded-md w-1/3'> 
        <p className='my-2'>List of students who have joined the class</p>
        <Button className='font-bold' type="primary" onClick={showAttendanceListModal}>
          Show
        </Button>
      </div>

    </div>
  );
};

export default AttendanceCodeSolo;
