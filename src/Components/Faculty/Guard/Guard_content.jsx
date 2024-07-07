import React, { useState, useEffect, useRef } from 'react';
import { Layout, Alert } from 'antd';
import userImg from '../../../assets/user.png';
import socketIOClient from 'socket.io-client';

const gatepassSERVER = 'wss://macts-backend-gatepass-production.up.railway.app';
const studentInfoServerUrl = 'https://macts-backend-webapp-production-0bd2.up.railway.app';
const studentDeviceServerUrl = 'https://macts-backend-webapp-production-0bd2.up.railway.app/studentDevice';

const { Content: AntdContent } = Layout;

const GuardContent = () => {
  const [currentTagData, setCurrentTagData] = useState('');
  const [currentStudentInfo, setCurrentStudentInfo] = useState(null);
  const [currentDeviceInfo, setCurrentDeviceInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [lastTapTime, setLastTapTime] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const timeoutRef = useRef(null);
  const tapTimeoutRef = useRef(null);

  useEffect(() => {
    const socket = socketIOClient(gatepassSERVER);

    socket.on('tagData', receivedData => {
      console.log('Received tag data:', receivedData);

      const now = new Date();
      if (lastTapTime && now - lastTapTime < 60000 && receivedData === currentTagData) {
        setIsAlertVisible(true);
        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current);
        }
        tapTimeoutRef.current = setTimeout(() => {
          setIsAlertVisible(false);
        }, 5000); // Hide alert after 5 seconds
        return;
      }

      fetchStudentDeviceInfo(receivedData).then((isValid) => {
        if (isValid) {
          setCurrentTagData(receivedData);
          setCurrentTime(now.toLocaleString());
          setLastTapTime(now);
          fetchStudentInfo(isValid.user_id);
        }
      });
    });

    return () => {
      socket.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, [lastTapTime, currentTagData]);

  const fetchStudentDeviceInfo = async (tagData) => {
    try {
      const response = await fetch(studentDeviceServerUrl);
      const deviceData = await response.json();
      const matchedDevice = deviceData.find(device => device.deviceRegistration === tagData);

      if (matchedDevice) {
        setCurrentDeviceInfo(matchedDevice);
        return matchedDevice;
      } else {
        setCurrentDeviceInfo(null);
        return false;
      }
    } catch (error) {
      console.error('Error fetching device information:', error);
      return false;
    }
  };

  const fetchStudentInfo = async (userId) => {
    try {
      const response = await fetch(`${studentInfoServerUrl}/studentinfo`);
      const data = await response.json();
      const matchedStudent = data.find(student => student.user_id === userId);

      if (matchedStudent) {
        setCurrentStudentInfo(matchedStudent);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          console.log('Clearing student and device info');
          setCurrentStudentInfo(null);
          setCurrentDeviceInfo(null);
        }, 15000); // Clear info after 15 seconds
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

      {currentStudentInfo && currentDeviceInfo ? (
        <>
          <div className='border-solid border-r w-1/3 m-0 h-full'>
            <div className='shadow-sm w-full h-[60%] flex justify-center items-center'>
              <img
                src={currentStudentInfo.student_profile}
                alt="Profile" 
                className="m-4 mt-4.5 w-60 h-60 bg-cover p-7 rounded-full"
              />
            </div>
            <div className='h-[40%] mx-5 my-5 space-y-2'>
              <p className='text-base'>TUP ID: <span className='font-semibold'>{currentStudentInfo.studentInfo_tuptId}</span></p>
              <p className='text-base'>Name: <span className='font-semibold'>{`${currentStudentInfo.studentInfo_first_name} ${currentStudentInfo.studentInfo_middle_name} ${currentStudentInfo.studentInfo_last_name}`}</span></p>
              <p className='text-base'>Course: <span className='font-semibold'>{currentStudentInfo.studentInfo_course}</span></p>
              <p className='text-base'>Section: <span className='font-semibold '>{currentStudentInfo.studentInfo_section}</span></p>
              <p className='text-base'>Time: <span className='font-semibold'>{currentTime}</span></p>
            </div>
          </div>

          <div className='w-2/3 h-full py-14 px-10'>
            <div className='flex justify-center'>
              <img
                src={currentDeviceInfo.device_image_url}
                alt="Device"
                className='bg-black w-9/12 rounded-2xl'
              />
            </div>
            <div className='mt-5 space-y-2'>
              <p className='text-xl'>Device name: <span className='font-semibold'>{currentDeviceInfo.device_name}</span></p>
              <p className='text-xl'>Serial number: <span className='font-semibold'>{currentDeviceInfo.device_serialNumber}</span></p>
              <p className='text-xl'>Device color: <span className='font-semibold'>{currentDeviceInfo.device_color}</span></p>
              <p className='text-xl'>Device brand: <span className='font-semibold'>{currentDeviceInfo.device_brand}</span></p>
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

export default GuardContent;
