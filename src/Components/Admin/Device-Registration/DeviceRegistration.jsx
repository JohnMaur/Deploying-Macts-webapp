import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Layout, message } from 'antd';
import axios from 'axios';
import copyIcon from "../../../assets/copy.png";

const { Content: AntdContent } = Layout;
// const serverUrl = 'wss://rfiddevice-registrationserver-production.up.railway.app';
const serverUrl = 'wss://macts-backend-device-registration.onrender.com';

const DeviceRegistration = () => {
  const [tagHistory, setTagHistory] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [deviceCodeValue, setDeviceCodeValue] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(serverUrl);

    socket.on('tagData', receivedData => {
      setTagHistory(prevHistory => [
        ...prevHistory,
        { tagData: receivedData, timestamp: new Date().toLocaleTimeString() }
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = async () => {
    try {
      // const response = await axios.get(`https://macts-backend-webapp-production-0bd2.up.railway.app/deviceRegistration?serialNumber=${searchValue}`);
      const response = await axios.get(`https://macts-backend-webapp.onrender.com/deviceRegistration?serialNumber=${searchValue}`);
      const studentDevice = response.data;
      setDeviceInfo(studentDevice);
    } catch (error) {
      console.error('Error fetching device data:', error);
      message.error('Error fetching device data');
    }
  };

  const handleRegister = async () => {
    try {
      if (!searchValue || !deviceCodeValue) {
        console.error('Serial number and device code value are required.');
        message.error('Serial number and device code value are required.');
        return;
      }

      // const response = await axios.post(`https://macts-backend-webapp-production-0bd2.up.railway.app/deviceRegistration/${searchValue}`, {
      const response = await axios.post(`https://macts-backend-webapp.onrender.com/deviceRegistration/${searchValue}`, {
        deviceCode: deviceCodeValue
      });

      if (response.data.error === 'Duplicate tagValue') {
        message.error({
          content: 'The Device code Value has already been registered.',
          duration: 3,
          style: {
            fontSize: '16px',
          },
        });
      } else {
        message.success({
          content: 'Your device registered successfully!',
          duration: 3,
          style: {
            fontSize: '20px',
          },
        });
      }
    } catch (error) {
      console.error('Error inserting device code value:', error);
      message.error('Error inserting device code value');
    }
  };

  const handleSetDeviceCode = (tagData) => {
    setDeviceCodeValue(tagData);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className='flex flex-col md:flex-row h-full'>
      <div className="bg-slate-50 flex-1 my-10 mx-5 ml-10 shadow-md rounded-lg md:max-h-[370px] md:overflow-y-auto max-w-96">
        <h1 className='text-lg font-bold mx-5 mt-5 mb-2'>RFID Tag History</h1>
        <ul>
          {tagHistory.map((entry, index) => (
            <li key={index}>
              <div className='flex ml-5 text-base items-center justify-between mr-5'>
                <div className='flex items-center'>
                  <p className="mb-1">Tag Data: <span className='font-bold'>{entry.tagData}</span> </p>
                  <div className="relative inline-block">
                    <button
                      className="ml-1 w-5 h-5 hover:bg-gray-200 hover:rounded-md hover:shadow-md"
                      onClick={() => handleSetDeviceCode(entry.tagData)}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={copyIcon}
                        alt="Copy Icon"
                      />
                    </button>
                    {hoveredIndex === index && (
                      <span className="w-[7.4rem] z-50 absolute left-0 mt-8 py-1 px-2 bg-gray-800 text-white text-xs rounded-md shadow-md">
                        Set Device Code
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
            placeholder='Insert your Device Code'
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
