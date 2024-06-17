import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Layout, message } from 'antd'; // Import message from antd for displaying alerts
import axios from 'axios';

const { Content: AntdContent } = Layout;
const serverUrl = 'http://localhost:3232'; // Change the port to match your server's port

const DeviceRegistration = () => {
  const [tagHistory, setTagHistory] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [deviceCodeValue, setDeviceCodeValue] = useState('');

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = socketIOClient(serverUrl);

    // Listen for 'tagData' events from the server
    socket.on('tagData', receivedData => {
      // Update the tagHistory state with the new tag data and timestamp
      setTagHistory(prevHistory => [
        ...prevHistory,
        { tagData: receivedData, timestamp: new Date().toLocaleTimeString() }
      ]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:2526/deviceRegistration?serialNumber=${searchValue}`);
      const studentDevice = response.data;
      setDeviceInfo(studentDevice);
    } catch (error) {
      console.error('Error fetching device data:', error);
      message.error('Error fetching device data');
    }
  };

  const handleRegister = async () => {
    try {
      // Ensure both serial number and device code value are available
      if (!searchValue || !deviceCodeValue) {
        console.error('Serial number and device code value are required.');
        message.error('Serial number and device code value are required.');
        return;
      }

      // Make a POST request to insert the device code value into the database
      const response = await axios.post(`http://localhost:2526/deviceRegistration/${searchValue}`, {
        deviceCode: deviceCodeValue
      });

      if (response.data.error === 'Duplicate tagValue') {
        // Show alert for duplicate tag value
        message.error({
          content: 'The Device code Value has already been registered.',
          duration: 3, // Duration in seconds
          style: {
            fontSize: '16px', // Adjust font size
          },
        });
      } else {
        // Show success alert for successful registration
        message.success({
          content: 'Your device registered successfully!',
          duration: 3, // Duration in seconds
          style: {
            fontSize: '20px', // Adjust font size
          },
        });
      }
    } catch (error) {
      console.error('Error inserting device code value:', error);
      message.error('Error inserting device code value');
    }
  };

  return (
    <div className='flex flex-col md:flex-row h-full'>
      <div className="bg-slate-50 flex-1 my-10 mx-5 ml-10 shadow-md rounded-lg md:max-h-[370px] md:overflow-y-auto">
        <h1 className='text-lg font-bold mx-5 mt-5 mb-2'>RFID Tag History</h1>
        <ul>
          {tagHistory.map((entry, index) => (
            <li key={index}>
              <div className='flex ml-5 text-lg'>
                <p className="w-1/2 mb-1">Tag Data: <span className='font-bold'>{entry.tagData}</span> </p>
                <p>Time: <span className='font-bold'>{entry.timestamp}</span></p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 md:h-5/6 my-10 mx-5 mr-10 flex">
        <div className="flex-1 md:overflow-y-auto h-[95%] mx-8 bg-slate-50 shadow-md p-5 px-10 rounded-lg">
          <p className='text-xl'>Device name: <span className='font-bold'>{deviceInfo.length > 0 ? deviceInfo[0].device_name : ''}</span></p>
          <p className='text-xl'>Serial number: <span className='font-bold'>{deviceInfo.length > 0 ? deviceInfo[0].device_serialNumber : ''}</span></p>
          <p className='text-xl'>Device color: <span className='font-bold'>{deviceInfo.length > 0 ? deviceInfo[0].device_color : ''}</span></p>
          <p className='text-xl'>Device brand: <span className='font-bold'>{deviceInfo.length > 0 ? deviceInfo[0].device_brand : ''}</span></p>
          <input
            className="w-full my-4 py-1.5 rounded-lg px-5 border-black border-solid border-[1px]"
            type="text"
            placeholder='Serial Number'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <input
            className="w-full mb-4 py-1.5 rounded-lg px-5 border-black border-solid border-[1px]"
            type="text"
            placeholder='Insert your RFID tag'
            value={deviceCodeValue}
            onChange={(e) => setDeviceCodeValue(e.target.value)}
          />

          <div className='flex gap-2'>
            <button className='bg-white text-black px-10 py-2 rounded-lg hover:bg-gray-50 active:opacity-40 border-[1px] border-black border-solid'
              onClick={handleSearch}>
              Search
            </button>
            <button className='bg-black text-white px-10 py-2 rounded-lg hover:opacity-70 active:opacity-40'
              onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceRegistration;