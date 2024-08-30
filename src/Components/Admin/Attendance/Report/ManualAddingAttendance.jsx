import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { message } from 'antd';

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10000, // Apply zIndex here
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '80%',
    width: '600px',
    overflow: 'visible', // Ensure the content is not cut off
  },
};

const ManualAddingAttendance = ({ isOpen, onRequestClose }) => {
  const [tuptId, setTuptId] = useState('');
  const [attendanceDescription, setAttendanceDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchStudentInfo = async () => {
    if (!tuptId) {
      return;
    }

    try {
      // const response = await axios.get(`https://macts-backend-webapp-production-0bd2.up.railway.app/studentinfo/${tuptId}`);
      const response = await axios.get(`https://macts-backend-webapp.onrender.com/studentinfo/${tuptId}`);
      setStudentInfo(response.data);
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  };

  const handleAdd = async () => {
    if (studentInfo) {
      const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      const attendanceData = {
        attendance_firstName: studentInfo.studentInfo_first_name,
        attendance_middleName: studentInfo.studentInfo_middle_name,
        attendance_Lastname: studentInfo.studentInfo_last_name,
        attendance_tupId: studentInfo.studentInfo_tuptId,
        attendance_course: studentInfo.studentInfo_course,
        attendance_section: studentInfo.studentInfo_section,
        attendance_email: studentInfo.user_email,
        attendance_historyDate: formattedDate, // Use the formatted date
        attendance_code: attendanceDescription,
        user_id: studentInfo.user_id,
      };

      try {
        // await axios.post('https://macts-backend-webapp-production-0bd2.up.railway.app/Manual/attendance', attendanceData);
        await axios.post('https://macts-backend-webapp.onrender.com/Manual/attendance', attendanceData);

        // Show success message
        message.success({
          content: 'New attendance successfully added.',
          duration: 3, // Duration in seconds
          style: {
            fontSize: '20px', // Adjust font size
          },
        });

        // Clear inputs
        setTuptId('');
        setAttendanceDescription('');
        setDate(new Date());
        setStudentInfo(null);

        onRequestClose(); // Close modal on successful addition
      } catch (error) {
        console.error('Error adding attendance record:', error);
      }
    }
  };

  const formattedDate = date.toLocaleString('en-US'); // Format the date for display

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      contentLabel="Manual Insertion to Attendance History"
    >
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Manual Insertion to Attendance Record</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">TUPT ID</label>
          <input
            type="text"
            className="mt-1 block w-full border-[1px] border-gray-400 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            value={tuptId}
            onChange={(e) => setTuptId(e.target.value)}
            onBlur={fetchStudentInfo}
          />
        </div>
        {studentInfo && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-[1px] border-gray-400 rounded-md shadow-sm p-2"
                value={`${studentInfo.studentInfo_first_name} ${studentInfo.studentInfo_middle_name} ${studentInfo.studentInfo_last_name}`}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <input
                type="text"
                className="mt-1 block w-full border-[1px] border-gray-400 rounded-md shadow-sm p-2"
                value={studentInfo.studentInfo_course}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input
                type="text"
                className="mt-1 block w-full border-[1px] border-gray-400 rounded-md shadow-sm p-2"
                value={studentInfo.studentInfo_section}
                readOnly
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Attendance Description</label>
          <input
            type="text"
            className="mt-1 block w-full border-[1px] border-gray-400 rounded-md shadow-sm p-2"
            value={attendanceDescription}
            onChange={(e) => setAttendanceDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date and Time</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="mt-1 block w-full border-[1px] border-gray-400 rounded-md shadow-sm p-2"
          />
          <div className="mt-2 text-sm text-gray-500">Selected Date: {formattedDate}</div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
            onClick={onRequestClose}
          >
            Close
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ManualAddingAttendance;
