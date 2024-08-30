import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Layout, message } from 'antd';
import copyIcon from "../../../assets/copy.png";
import axios from 'axios';

const { Content: AntdContent } = Layout;
// const serverUrl = 'wss://macts-backend-rfid-registration-production.up.railway.app';
const serverUrl = 'wss://macts-backend-rfid-registration.onrender.com';

const RFID_Content = ({ borderRadiusLG }) => {
  const [tagHistory, setTagHistory] = useState([]);
  const [studentInfo, setStudentInfo] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [rfidTagValue, setRfidTagValue] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = socketIOClient(serverUrl);

    // Listen for 'tagData' events from the server
    socket.on('tagData', receivedData => {
      // Update the tagHistory state with the new tag data and timestamp
      setTagHistory(prevHistory => [
        { tagData: receivedData, timestamp: new Date().toLocaleTimeString() },
        ...prevHistory // Prepend new data
      ]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = async () => {
    try {
      // const response = await axios.get(`https://macts-backend-webapp-production-0bd2.up.railway.app/rfidRegistration/studentInfo?tuptId=${searchValue}`);
      const response = await axios.get(`https://macts-backend-webapp.onrender.com/rfidRegistration/studentInfo?tuptId=${searchValue}`);
      const studentData = response.data;
      setStudentInfo(studentData);
    } catch (error) {
      console.error('Error fetching RFID data:', error);
    }
  };

  const handleRegister = async () => {
    try {
      // Ensure both TUPT ID and RFID tag value are available
      if (!searchValue || !rfidTagValue) {
        console.error('TUPT ID and RFID tag value are required.');
        return;
      }

      // Make a POST request to insert the RFID tag value into the database
      // const response = await axios.post(`https://macts-backend-webapp-production-0bd2.up.railway.app/rfidRegistration/${searchValue}`, {
      const response = await axios.post(`https://macts-backend-webapp.onrender.com/rfidRegistration/${searchValue}`, {
        tagValue: rfidTagValue
      });

      if (response.data.error === 'Duplicate tagValue') {
        // Show alert for duplicate tag value
        message.error({
          content: 'The Tag Value has already been registered.',
          duration: 3, // Duration in seconds
          style: {
            fontSize: '16px', // Adjust font size
          },
        });
      } else {
        // Show success alert for successful registration
        message.success({
          content: 'RFID tag value inserted successfully.',
          duration: 3, // Duration in seconds
          style: {
            fontSize: '20px', // Adjust font size
          },
        });

        // Clear input fields and reset state after successful registration
        setSearchValue('');
        setRfidTagValue('');
        setStudentInfo([]);
      }
    } catch (error) {
      console.error('Error inserting RFID tag value:', error);
    }
  };

  const handleSetRfidTag = (tagData) => {
    setRfidTagValue(tagData);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index); // Set the index of the hovered item
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null); // Reset hovered index when mouse leaves
  };

  return (
    <AntdContent
      style={{
        margin: '0 2.5rem 2rem 2.5rem',
        minHeight: 420,
        background: "white",
        borderRadius: borderRadiusLG,
        overflowX: 'auto',
      }}
    >
      <div className='lg:flex lg:flex-row h-full sm:flex-col '>
        <div className="
          sm:max-h-[25rem] min-w-20rem min-h-20rem
          bg-slate-50 flex-1 my-10 mx-5 ml-10 shadow-md rounded-lg md:max-h-[370px] md:overflow-y-auto
          ">
          <h1 className='text-lg font-bold mx-5 mt-5 mb-2'>RFID Tag History</h1>
          <ul>
            {tagHistory.map((entry, index) => (
              <li key={index}>
                <div className='flex ml-5 text-base items-center justify-between mr-5'>
                  <div className='flex items-center'>
                    <p className="mb-1">Tag Data: <span className='font-bold'>{entry.tagData}</span></p>
                    <div className="relative inline-block">
                      <button
                        className="ml-1 w-5 h-5 hover:bg-gray-200 hover:rounded-md hover:shadow-md"
                        onClick={() => handleSetRfidTag(entry.tagData)}
                        onMouseEnter={() => handleMouseEnter(index)} // Pass index to handler
                        onMouseLeave={handleMouseLeave}
                      >
                        <img
                          src={copyIcon}
                          alt="Copy Icon"
                        />
                      </button>
                      {hoveredIndex === index && ( // Render message only if hoveredIndex matches current index
                        <span className="w-16 absolute left-0 mt-6 py-1 px-2 bg-gray-800 text-white text-xs rounded-md shadow-md">
                          Set RFID
                        </span>
                      )}
                    </div>
                  </div>
                  <p>Time: <span className='font-bold'>{entry.timestamp}</span></p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 md:h-5/6 my-10 mx-5 mr-10 flex sm:max-h-[22rem] lg:max-h-[25rem]">
          <div className="flex-1 md:overflow-y-auto h-[95%] mx-8 bg-slate-50 shadow-md p-5 px-10 rounded-lg">
            <p className='text-lg md:text-xl lg:text-2xl'>Name: <span className='font-bold'>{studentInfo.length > 0 ? `${studentInfo[0].studentInfo_first_name} ${studentInfo[0].studentInfo_middle_name} ${studentInfo[0].studentInfo_last_name}` : ''}</span></p>
            <p className='text-lg md:text-xl lg:text-2xl'>TUPT ID: <span className='font-bold'>{studentInfo.length > 0 ? studentInfo[0].studentInfo_tuptId : ''}</span></p>
            <p className='text-lg md:text-xl lg:text-2xl'>Course: <span className='font-bold'>{studentInfo.length > 0 ? studentInfo[0].studentInfo_course : ''}</span></p>
            <p className='text-lg md:text-xl lg:text-2xl'>Section: <span className='font-bold'>{studentInfo.length > 0 ? studentInfo[0].studentInfo_section : ''}</span></p>
            <input
              className="w-full my-4 py-2 md:py-1.5 lg:py-2 rounded-lg px-5 border-black border-solid border-[1px]"
              type="text"
              placeholder='TUPT-**-****'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <input
              className="w-full mb-4 py-2 md:py-1.5 lg:py-2 rounded-lg px-5 border-black border-solid border-[1px]"
              type="text"
              placeholder='Insert your RFID tag'
              value={rfidTagValue}
              onChange={(e) => setRfidTagValue(e.target.value)}
            />

            <div className='flex flex-col md:flex-row md:gap-2'>
              <button className='bg-white text-black px-10 py-2 md:py-2 lg:py-3 rounded-lg hover:bg-gray-50 active:opacity-40 border-[1px] border-black border-solid'
                onClick={handleSearch}>
                Search
              </button>
              <button className='bg-black text-white px-10 py-2 md:py-2 lg:py-3 rounded-lg hover:opacity-70 active:opacity-40 mt-2 md:mt-0'
                onClick={handleRegister}>
                Register
              </button>
            </div>
          </div>
        </div>

      </div>
    </AntdContent>
  );
};

export default RFID_Content;
