import React, { useState, useEffect, useRef } from 'react';
import { Layout, Alert } from 'antd';
import userImg from '../../../assets/user.png';
import socketIOClient from 'socket.io-client';

const attendanceServer = 'wss://macts-backend-attendance.onrender.com';
const studentInfoServerUrl = 'https://macts-backend-webapp.onrender.com';
const { Content: AntdContent } = Layout;

const TeacherContent = ({ borderRadiusLG }) => {
  const [currentTagData, setCurrentTagData] = useState('');
  const [currentStudentInfo, setCurrentStudentInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [lastTapTime, setLastTapTime] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const timeoutRef = useRef(null);
  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    const socket = socketIOClient(attendanceServer);

    socket.on('tagData', receivedData => {
      const now = new Date();
      if (lastTapTime && now - lastTapTime < 60000 && receivedData === currentTagData) {
        setIsAlertVisible(true);
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
        }
        alertTimeoutRef.current = setTimeout(() => {
          setIsAlertVisible(false);
        }, 5000); // Hide alert after 5 seconds
        return;
      }

      isValidTagData(receivedData).then((isValid) => {
        if (isValid) {
          setCurrentTagData(receivedData);
          setCurrentTime(now.toLocaleString());
          setLastTapTime(now);
          fetchStudentInfo(receivedData);
        }
      });
    });

    return () => {
      socket.disconnect();
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [lastTapTime, currentTagData]);

  const isValidTagData = async (tagData) => {
    try {
      const response = await fetch(`${studentInfoServerUrl}/studentinfo`);
      const data = await response.json();
      const isValid = data.some(student => student.tagValue === tagData);
      return isValid;
    } catch (error) {
      console.error('Error fetching student information:', error);
      return false;
    }
  };

  const fetchStudentInfo = async (tagData) => {
    try {
      const response = await fetch(`${studentInfoServerUrl}/studentinfo`);
      const data = await response.json();
      const matchedStudent = data.find(student => student.tagValue === tagData);

      if (matchedStudent) {
        setCurrentStudentInfo(matchedStudent);

        // Clear the data after 10 seconds
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setCurrentStudentInfo(null);
        }, 10000);
      } else {
        setCurrentStudentInfo(null);
      }
    } catch (error) {
      console.error('Error fetching student information:', error);
    }
  };

  return (
    <AntdContent className="shadow-md"
      style={{
        margin: '24px 16px',
        minHeight: 280,
        background: "rgb(252, 252, 252)",
        borderRadius: 12,
        display: "flex",
        position: "relative"
      }}
    >
      {isAlertVisible && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}>
          <Alert
            message="Duplicate Tap Detected"
            description="You've already tapped your RFID card. Please wait for a minute before tapping again."
            type="warning"
            showIcon
          />
        </div>
      )}

      {currentStudentInfo ? (
        <>
          <div className='lg:border-solid lg:border-r lg:w-1/3 lg:m-0 lg:h-full'>
            <div className='lg:shadow-sm lg:w-full lg:h-[60%] lg:flex lg:justify-center lg:items-center'>
              <img
                src={currentStudentInfo.student_profile || userImg}
                alt="Profile"
                className="
                  sm:m-4 sm:mt-4.5 sm:w-20 sm:h-20 sm:bg-cover
                  lg:m-4 lg:mt-4.5 lg:w-60 lg:h-60 lg:bg-cover lg:p-7 rounded-full
                  "
              />
            </div>
          </div>

          <div className='w-2/3 h-full py-14 px-10 flex items-center'>
            <div className='space-y-4'>
              <p className='librarian-text'>TUP ID: <span className='font-semibold'>{currentStudentInfo.studentInfo_tuptId}</span></p>
              <p className='librarian-text'>Name: <span className='font-semibold'>{`${currentStudentInfo.studentInfo_first_name} ${currentStudentInfo.studentInfo_middle_name} ${currentStudentInfo.studentInfo_last_name}`}</span></p>
              <p className='librarian-text'>Course: <span className='font-semibold'>{currentStudentInfo.studentInfo_course}</span></p>
              <p className='librarian-text'>Section: <span className='font-semibold'>{currentStudentInfo.studentInfo_section}</span></p>
              <p className='librarian-text'>Time: <span className='font-semibold'>{currentTime}</span></p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='border-solid border-r w-1/3 m-0 h-full'>
            <div className='shadow-sm w-full h-[60%] flex justify-center items-center'>
              <img
                src={userImg}
                alt="Profile"
                className="m-4 mt-4.5 w-60 h-60 bg-cover p-7"
              />
            </div>
          </div>

          <div className='w-2/3 h-full py-14 px-10 flex items-center'>
            <div className='flex justify-center w-full'>
              <p className='sm:text-xl md:text-3xl lg:text-5xl 2xl:text-8xl font-sans font-bold text-gray-500'>TAP YOUR RFID CARD</p>
            </div>
          </div>
        </>
      )}
    </AntdContent>
  );
};

export default TeacherContent;
