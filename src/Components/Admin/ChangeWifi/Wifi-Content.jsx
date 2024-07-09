// import React, { useState, useEffect } from 'react';
// import { Layout, Modal, message } from 'antd';
// import axios from 'axios';

// const { Content: AntdContent } = Layout;

// const WifiContent = ({ colorBgContainer, borderRadiusLG }) => {
//   const [ssid, setSsid] = useState('');
//   const [password, setPassword] = useState('');
//   const [serialPortAvailable, setSerialPortAvailable] = useState(true); // Track serial port availability
//   const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
//   const [arduinoMessages, setArduinoMessages] = useState([]); // State to store Arduino messages

//   useEffect(() => {
//     // Function to check if serial port is available
//     const checkSerialPortAvailability = async () => {
//       try {
//         const response = await axios.get('wss://changewifiserver.onrender.com/check-serial-port');
//         setSerialPortAvailable(response.data.available);
//       } catch (error) {
//         console.error('Error checking serial port:', error);
//         setSerialPortAvailable(false); // Assume not available on error
//       }
//     };

//     // Function to fetch Arduino messages
//     const fetchArduinoMessages = async () => {
//       try {
//         const response = await axios.get('wss://changewifiserver.onrender.com/arduino-messages');
//         setArduinoMessages(prevMessages => [...response.data.messages]);
//       } catch (error) {
//         console.error('Error fetching Arduino messages:', error);
//       }
//     };


//     // Call the function initially and set up interval to fetch messages every 10 seconds
//     fetchArduinoMessages();
//     const interval = setInterval(fetchArduinoMessages, 10000);

//     // Check serial port availability periodically
//     checkSerialPortAvailability();
//     const serialPortInterval = setInterval(checkSerialPortAvailability, 10000);

//     return () => {
//       clearInterval(interval);
//       clearInterval(serialPortInterval);
//     }; // Cleanup intervals on component unmount
//   }, []);

//   const handleSSIDChange = (event) => {
//     setSsid(event.target.value);
//   };

//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     // Show modal for confirmation
//     setModalVisible(true);
//   };

//   const handleConfirm = async () => {
//     try {
//       // Check SSID and password before sending the request
//       if (!ssid.trim() || !password.trim()) {
//         message.error('SSID and password cannot be empty.');
//         return;
//       }

//       // Send update request
//       const response = await axios.post('wss://changewifiserver.onrender.com/update-wifi', { ssid, password });
//       console.log(response.data); // Handle success message
//       // Show success message
//       message.success('You have successfully updated WiFi.');
//       // Clear input fields
//       setSsid('');
//       setPassword('');
//     } catch (error) {
//       console.error('Error updating WiFi:', error);
//     } finally {
//       // Close the modal
//       setModalVisible(false);
//     }
//   };

//   const handleCancel = () => {
//     // Close the modal without taking any action
//     setModalVisible(false);
//   };

//   return (
//     <AntdContent
//       style={{
//         margin: '24px 16px',
//         padding: 24,
//         minHeight: 280,
//         maxHeight: '100vh',
//         background: colorBgContainer,
//         borderRadius: borderRadiusLG,
//       }}
//     >
//       <div className='flex space-x-5'>
//         <div className="w-96 max-w-lg mx-auto md:mx-0">
//           <h2 className="text-2xl font-bold mb-4">Configure WiFi</h2>
//           {!serialPortAvailable && (
//             <div className="text-red-500 mb-4">Please connect your device...</div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block mb-1">SSID:</label>
//               <input
//                 type="text"
//                 value={ssid}
//                 onChange={handleSSIDChange}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                 disabled={!serialPortAvailable} // Disable input when serial port is not available
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Password:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={handlePasswordChange}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                 disabled={!serialPortAvailable} // Disable input when serial port is not available
//               />
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 className={`w-full py-2 px-4 rounded-lg focus:outline-none ${serialPortAvailable ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold cursor-pointer' : 'bg-gray-400 cursor-not-allowed text-white font-bold'
//                   }`}
//                 disabled={!serialPortAvailable || !ssid.trim() || !password.trim()} // Disable button when serial port is not available or inputs are empty
//               >
//                 {serialPortAvailable ? 'Update WiFi' : 'Device Unavailable'}
//               </button>
//             </div>
//           </form>
//         </div>

//         <div>
//           <h3 className="text-xl font-bold mb-4">Serial Monitor</h3>
//           <div className='w-96 bg-white h-64 rounded-lg shadow-lg'>
//             <div className="h-full overflow-auto p-4">
//               {arduinoMessages.slice(0).reverse().map((message, index) => (
//                 <p key={index} className="text-black">{message}</p>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//       {/* Modal for confirmation */}
//       <Modal
//         title="Verify WiFi Update"
//         visible={modalVisible}
//         onOk={handleConfirm}
//         onCancel={handleCancel}
//         okText="Confirm"
//         cancelText="Close"
//         okButtonProps={{ className: 'bg-blue-500 text-white' }}
//         cancelButtonProps={{ className: 'bg-red-500 text-white' }}
//       >
//         <p>Make sure your SSID and your Password are correct, otherwise the device will connect to a different Wi-Fi...</p>
//       </Modal>
//     </AntdContent>
//   );
// };

// export default WifiContent;

// import React, { useState, useEffect } from 'react';
// import { Layout, Modal, message } from 'antd';
// import axios from 'axios';
// import { io } from 'socket.io-client';

// const { Content: AntdContent } = Layout;

// const WifiContent = ({ colorBgContainer, borderRadiusLG }) => {
//   const [ssid, setSsid] = useState('');
//   const [password, setPassword] = useState('');
//   const [serialPortAvailable, setSerialPortAvailable] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [arduinoMessages, setArduinoMessages] = useState([]);

//   useEffect(() => {
//     const checkSerialPortAvailability = async () => {
//       try {
//         const response = await axios.get('http://localhost:3535/check-serial-port');
//         setSerialPortAvailable(response.data.available);
//       } catch (error) {
//         console.error('Error checking serial port:', error);
//         setSerialPortAvailable(false);
//       }
//     };

//     checkSerialPortAvailability();
//     const serialPortInterval = setInterval(checkSerialPortAvailability, 10000);

//     const socket = io('http://localhost:3535');
//     socket.on('connect', () => {
//       console.log('WebSocket connected');
//     });

//     socket.on('message', (data) => {
//       const parsedData = JSON.parse(data);
//       if (parsedData.messages) {
//         setArduinoMessages(parsedData.messages);
//       } else if (parsedData.message) {
//         setArduinoMessages((prevMessages) => [...prevMessages, parsedData.message]);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('WebSocket disconnected');
//     });

//     return () => {
//       clearInterval(serialPortInterval);
//       socket.disconnect();
//     };
//   }, []);

//   const handleSSIDChange = (event) => {
//     setSsid(event.target.value);
//   };

//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setModalVisible(true);
//   };

//   const handleConfirm = async () => {
//     try {
//       if (!ssid.trim() || !password.trim()) {
//         message.error('SSID and password cannot be empty.');
//         return;
//       }

//       const response = await axios.post('http://localhost:3535/update-wifi', { ssid, password });
//       console.log(response.data);
//       message.success('You have successfully updated WiFi.');
//       setSsid('');
//       setPassword('');
//     } catch (error) {
//       console.error('Error updating WiFi:', error);
//     } finally {
//       setModalVisible(false);
//     }
//   };

//   const handleCancel = () => {
//     setModalVisible(false);
//   };

//   return (
//     <AntdContent
//       style={{
//         margin: '24px 16px',
//         padding: 24,
//         minHeight: 280,
//         maxHeight: '100vh',
//         background: colorBgContainer,
//         borderRadius: borderRadiusLG,
//       }}
//     >
//       <div className='flex space-x-5'>
//         <div className="w-96 max-w-lg mx-auto md:mx-0">
//           <h2 className="text-2xl font-bold mb-4">Configure WiFi</h2>
//           {!serialPortAvailable && (
//             <div className="text-red-500 mb-4">Please connect your device...</div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block mb-1">SSID:</label>
//               <input
//                 type="text"
//                 value={ssid}
//                 onChange={handleSSIDChange}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                 disabled={!serialPortAvailable}
//               />
//             </div>
//             <div>
//               <label className="block mb-1">Password:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={handlePasswordChange}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
//                 disabled={!serialPortAvailable}
//               />
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 className={`w-full py-2 px-4 rounded-lg focus:outline-none ${serialPortAvailable ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold cursor-pointer' : 'bg-gray-400 cursor-not-allowed text-white font-bold'
//                   }`}
//                 disabled={!serialPortAvailable || !ssid.trim() || !password.trim()}
//               >
//                 {serialPortAvailable ? 'Update WiFi' : 'Device Unavailable'}
//               </button>
//             </div>
//           </form>
//         </div>

//         <div>
//           <h3 className="text-xl font-bold mb-4">Serial Monitor</h3>
//           <div className='w-96 bg-white h-64 rounded-lg shadow-lg'>
//             <div className="h-full overflow-auto p-4">
//               {arduinoMessages.slice(0).reverse().map((message, index) => (
//                 <p key={index} className="text-black">{message}</p>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Modal
//         title="Verify WiFi Update"
//         visible={modalVisible}
//         onOk={handleConfirm}
//         onCancel={handleCancel}
//         okText="Confirm"
//         cancelText="Close"
//         okButtonProps={{ className: 'bg-blue-500 text-white' }}
//         cancelButtonProps={{ className: 'bg-red-500 text-white' }}
//       >
//         <p>Make sure your SSID and your Password are correct, otherwise the device will connect to a different Wi-Fi...</p>
//       </Modal>
//     </AntdContent>
//   );
// };

// export default WifiContent;


import React, { useState, useEffect } from 'react';
import { Layout, Modal, message } from 'antd';
import axios from 'axios';
import { io } from 'socket.io-client';

const { Content: AntdContent } = Layout;

const WifiContent = ({ colorBgContainer, borderRadiusLG }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [serialPortAvailable, setSerialPortAvailable] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [arduinoMessages, setArduinoMessages] = useState([]);

  useEffect(() => {
    const checkSerialPortAvailability = async () => {
      try {
        const response = await axios.get('http://localhost:3535/check-serial-port');
        setSerialPortAvailable(response.data.available);
      } catch (error) {
        console.error('Error checking serial port:', error);
        setSerialPortAvailable(false);
      }
    };

    checkSerialPortAvailability();
    const serialPortInterval = setInterval(checkSerialPortAvailability, 10000);

    const socket = io('http://localhost:3535');
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('message', (data) => {
      setArduinoMessages((prevMessages) => [data, ...prevMessages]);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      clearInterval(serialPortInterval);
      socket.disconnect();
    };
  }, []);

  const handleSSIDChange = (event) => {
    setSsid(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      if (!ssid.trim() || !password.trim()) {
        message.error('SSID and password cannot be empty.');
        return;
      }

      const response = await axios.post('http://localhost:3535/update-wifi', { ssid, password });
      console.log(response.data);
      message.success('You have successfully updated WiFi.');
      setSsid('');
      setPassword('');
    } catch (error) {
      console.error('Error updating WiFi:', error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <AntdContent
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        maxHeight: '100vh',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <div className='flex space-x-5'>
        <div className="w-96 max-w-lg mx-auto md:mx-0">
          <h2 className="text-2xl font-bold mb-4">Configure WiFi</h2>
          {!serialPortAvailable && (
            <div className="text-red-500 mb-4">Please connect your device...</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">SSID:</label>
              <input
                type="text"
                value={ssid}
                onChange={handleSSIDChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                disabled={!serialPortAvailable}
              />
            </div>
            <div>
              <label className="block mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                disabled={!serialPortAvailable}
              />
            </div>
            <div>
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg focus:outline-none ${serialPortAvailable ? 'bg-blue-500 hover:bg-blue-600 text-white font-bold cursor-pointer' : 'bg-gray-400 cursor-not-allowed text-white font-bold'
                  }`}
                disabled={!serialPortAvailable || !ssid.trim() || !password.trim()}
              >
                {serialPortAvailable ? 'Update WiFi' : 'Device Unavailable'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Serial Monitor</h3>
          <div className='w-96 bg-white h-64 rounded-lg shadow-lg'>
            <div className="h-full overflow-auto p-4">
              {arduinoMessages.map((message, index) => (
                <p key={index} className="text-black">{message}</p>
              ))}
            </div>
          </div>
        </div>

      </div>
      <Modal
        title="Verify WiFi Update"
        visible={modalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Close"
        okButtonProps={{ className: 'bg-blue-500 text-white' }}
        cancelButtonProps={{ className: 'bg-red-500 text-white' }}
      >
        <p>Make sure your SSID and Password are correct, otherwise the device will connect to a different Wi-Fi...</p>
      </Modal>
    </AntdContent>
  );
};

export default WifiContent;
