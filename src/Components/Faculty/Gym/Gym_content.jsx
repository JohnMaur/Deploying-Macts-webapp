import React, { useState, useEffect } from 'react';
import { Layout, Alert } from 'antd';
import userImg from '../../../assets/user.png';
import socketIOClient from 'socket.io-client';

const gymServerUrl = 'wss://macts-backend-gym-production.up.railway.app';
const studentInfoServerUrl = 'https://macts-backend-webapp-production-0bd2.up.railway.app';
const { Content: AntdContent } = Layout;

const GymContentDashboard = ({ borderRadiusLG }) => {
  const [currentTagData, setCurrentTagData] = useState('');
  const [currentStudentInfo, setCurrentStudentInfo] = useState(null);
  const [currentTapStatus, setCurrentTapStatus] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [lastTapTime, setLastTapTime] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    const socket = socketIOClient(gymServerUrl);

    socket.on('tagData', receivedData => {
      console.log('Received tag data:', receivedData);

      const now = new Date();
      if (lastTapTime && now - lastTapTime < 60000 && receivedData === currentTagData) {
        setIsAlertVisible(true);
        setTimeout(() => {
          setIsAlertVisible(false);
        }, 5000); // Hide alert after 5 seconds
        return;
      }

      isValidTagData(receivedData).then((isValid) => {
        if (isValid) {
          setCurrentTagData(receivedData);
          setCurrentTime(now.toLocaleString()); // Update current time when tagData changes
          fetchStudentInfo(receivedData);
          setLastTapTime(now);
        }
      });
    });

    return () => {
      socket.disconnect();
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
        fetchTapStatus(matchedStudent.user_id);

        // Clear the data after 1 minute
        setTimeout(() => {
          setCurrentStudentInfo(null);
          setCurrentTapStatus('');
        }, 60000);
      } else {
        setCurrentStudentInfo(null);
        setCurrentTapStatus('');
      }
    } catch (error) {
      console.error('Error fetching student information:', error);
    }
  };

  const fetchTapStatus = async (userId) => {
    try {
      // Introduce a delay of 1 second (adjust as needed)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch(`${studentInfoServerUrl}/gym_status`);
      const tapStatusData = await response.json();

      if (tapStatusData.user_id === userId) {
        const status = tapStatusData.gym_OutHistoryDate ? 'Out' : (tapStatusData.gym_InHistoryDate ? 'In' : '');
        setCurrentTapStatus(status);
      } else {
        setCurrentTapStatus('');
      }
    } catch (error) {
      console.error('Error fetching tap status:', error);
    }
  };

  return (
    <AntdContent className="shadow-md"
      style={{
        margin: '24px 16px',
        minHeight: 280,
        background: "rgb(252, 252, 252)",
        borderRadius: 12,
        display: "flex"
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

      {currentStudentInfo && (
        <>
          <div className='border-solid border-r w-1/3 m-0 h-full'>
            <div className='shadow-sm w-full h-[60%] flex justify-center items-center'>
              {currentStudentInfo.student_profile ? (
                <img
                  src={currentStudentInfo.student_profile}
                  alt="Profile"
                  className="m-4 mt-4.5 w-60 h-60 bg-cover p-7 rounded-full"
                />
              ) : (
                <img
                  src={userImg}
                  alt="Profile"
                  className="m-4 mt-4.5 w-60 h-60 bg-cover p-7"
                />
              )}
            </div>
            <div className='flex justify-center h-[40%]'>
              <div>
                <div className='flex justify-center'>
                  <p className='font-semibold text-gray-600 text-xl mt-5'>Status:</p>
                </div>
                <div className='flex items-center h-3/6'>
                  <p className={`tapStatus ${currentTapStatus === 'In' ? 'text-green-700' : currentTapStatus === 'Out' ? 'text-red-700' : ''}`}>{currentTapStatus}</p>
                </div>
              </div>
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
      )}

      {!currentStudentInfo && (
        <>
          <div className='border-solid border-r w-1/3 m-0 h-full'>
            <div className='shadow-sm w-full h-[60%] flex justify-center items-center'>
              <img
                src={userImg}
                alt="Profile"
                className="m-4 mt-4.5 w-60 h-60 bg-cover p-7"
              />
            </div>
            <div className='flex justify-center items-center h-[40%]'>
              <p className='font-semibold text-gray-600 text-xl mt-5'>Status:</p>
              <p className='tapStatus'></p>
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

export default GymContentDashboard;
