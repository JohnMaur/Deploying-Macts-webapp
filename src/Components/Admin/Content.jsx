import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Typography, Alert } from 'antd';
import userImg from '../../assets/user.png';
import socketIOClient from 'socket.io-client';

// RFID tag servers
// const RegistrarRFIDserver = 'wss://macts-backend-registrar-production.up.railway.app';
// const attendanceRFIDServer = 'wss://macts-attendance-production.up.railway.app';
// const libraryRFIDserver = 'wss://macts-backend-library-production.up.railway.app';
// const gymRFIDserver = 'wss://macts-backend-gym-production.up.railway.app';
// const gatepassRFIDserver = 'wss://macts-backend-gatepass-production.up.railway.app';
const RegistrarRFIDserver = 'wss://macts-backend-registrar.onrender.com';
const attendanceRFIDServer = 'wss://macts-backend-attendance.onrender.com';
const libraryRFIDserver = 'wss://macts-backend-library.onrender.com';
const gymRFIDserver = 'wss://macts-backend-gym.onrender.com';
const gatepassRFIDserver = 'wss://macts-backend-gatepass.onrender.com';

// const studentInfoServerUrl = 'https://macts-backend-webapp-production-0bd2.up.railway.app';
const studentInfoServerUrl = 'https://macts-backend-webapp.onrender.com';

const { Content: AntdContent } = Layout;
const { Title, Text } = Typography;

const CustomContent = ({ colorBgContainer, borderRadiusLG }) => {
  const [currentTagData, setCurrentTagData] = useState('');
  const [previousTagData, setPreviousTagData] = useState('');
  const [currentStudentInfo, setCurrentStudentInfo] = useState(null);
  const [previousStudentInfo, setPreviousStudentInfo] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [previousTime, setPreviousTime] = useState('');
  const [currentSetting, setCurrentSetting] = useState('');
  const [previousSetting, setPreviousSetting] = useState('');
  const [lastTapTime, setLastTapTime] = useState(null); // State to track last tap time
  const [isAlertVisible, setIsAlertVisible] = useState(false); // State to track alert visibility

  useEffect(() => {
    const RegistrarSocket = socketIOClient(RegistrarRFIDserver);
    const attendanceSocket = socketIOClient(attendanceRFIDServer);
    const librarySocket = socketIOClient(libraryRFIDserver);
    const gymSocket = socketIOClient(gymRFIDserver);
    const gatepassSocket = socketIOClient(gatepassRFIDserver);

    const handleTagData = (receivedData, setting) => {
      const now = new Date();
      if (lastTapTime && (now - lastTapTime) < 60000) {
        setIsAlertVisible(true); // Show alert if tap is within 1 minute
        setTimeout(() => setIsAlertVisible(false), 3000); // Hide alert after 3 seconds
        console.log('Ignoring tap: Too soon since last tap');
        return; // Ignore the tap if it's within 1 minute of the last tap
      }
      isValidTagData(receivedData).then((isValid) => {
        if (isValid) {
          setLastTapTime(now); // Update last tap time
          setPreviousTagData(currentTagData); // Move current data to previous
          setPreviousTime(currentTime); // Move current time to previous
          setPreviousSetting(currentSetting); // Move current setting to previous
          setCurrentTagData(receivedData);
          setCurrentTime(new Date().toLocaleString()); // Update current time when tagData changes
          setCurrentSetting(setting); // Set the setting based on the server
        }
      });
    };

    RegistrarSocket.on('tagData', (receivedData) => {
      handleTagData(receivedData, 'Registrar');
    });
    attendanceSocket.on('tagData', (receivedData) => {
      handleTagData(receivedData, 'Attendance');
    });
    librarySocket.on('tagData', (receivedData) => {
      handleTagData(receivedData, 'Library');
    });
    gymSocket.on('tagData', (receivedData) => {
      handleTagData(receivedData, 'Gym');
    });
    gatepassSocket.on('tagData', (receivedData) => {
      handleTagData(receivedData, 'Gatepass');
    });

    return () => {
      RegistrarSocket.disconnect();
      attendanceSocket.disconnect();
      librarySocket.disconnect();
      gymSocket.disconnect();
      gatepassSocket.disconnect();
    };
  }, [currentTagData, currentTime, currentSetting, lastTapTime]);

  const isValidTagData = async (tagData) => {
    // Fetch student info data from the server
    try {
      const response = await fetch(`${studentInfoServerUrl}/studentinfo`);
      const data = await response.json();

      // Check if the tagData matches any tagValue in the student info data
      const isValid = data.some(student => student.tagValue === tagData);
      return isValid;
    } catch (error) {
      console.error('Error fetching student information:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        if (!currentTagData) return; // If tagData is empty, exit early

        // Fetch student info data from the server
        const response = await fetch(`${studentInfoServerUrl}/studentinfo`);
        const data = await response.json();

        // Find the student whose tagValue matches currentTagData
        const matchedStudent = data.find(student => student.tagValue === currentTagData);

        if (matchedStudent) {
          setCurrentStudentInfo(matchedStudent);
        } else {
          setCurrentStudentInfo(null);
        }
      } catch (error) {
        console.error('Error fetching student information:', error);
      }
    };

    fetchStudentInfo();
  }, [currentTagData]);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        if (!previousTagData) return; // If previousTagData is empty, exit early

        // Fetch student info data from the server
        const response = await fetch(`${studentInfoServerUrl}/studentinfo`);
        const data = await response.json();

        // Find the student whose tagValue matches previousTagData
        const matchedStudent = data.find(student => student.tagValue === previousTagData);

        if (matchedStudent) {
          setPreviousStudentInfo(matchedStudent);
        } else {
          setPreviousStudentInfo(null);
        }
      } catch (error) {
        console.error('Error fetching student information:', error);
      }
    };

    fetchStudentInfo();
  }, [previousTagData]);

  return (
    <AntdContent className="shadow-md"
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        background: "rgb(252, 252, 252)",
        borderRadius: borderRadiusLG,
      }}
    >
      <div className="card-body bg-light">
        <Title level={3}>Dashboard</Title>

        <Row gutter={[16, 16]}>
          {/* Main content column */}
          <Col xs={{ span: 24 }} sm={{ span: 16 }}>
            <Card className="shadow-md">
              {currentStudentInfo && (
                <React.Fragment>
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <img
                        src={`${currentStudentInfo.student_profile}`}
                        alt="Profile"
                        className="m-4 mt-4.5 w-full max-w-28 rounded-full h-full max-h-28"
                      />
                    </Col>
                    <Col span={18}>
                      <div className="card-body mt-8">


                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>TUP ID: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}>{currentStudentInfo.studentInfo_tuptId}</Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Name: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}>{`${currentStudentInfo.studentInfo_first_name} ${currentStudentInfo.studentInfo_middle_name} ${currentStudentInfo.studentInfo_last_name}`}</Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Course: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}>{currentStudentInfo.studentInfo_course}</Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Section: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}>{currentStudentInfo.studentInfo_section}</Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Setting: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}>{currentSetting}</Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Time: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}>{currentTime}</Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </React.Fragment>
              )}

              {/* Always render labels */}
              {!currentStudentInfo && (
                <React.Fragment>
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <img
                        src={userImg}
                        alt="Profile"
                        className="m-4 mt-4.5 w-full max-w-28"
                      />
                    </Col>

                    <Col span={18}>
                      <div className="card-body mt-8">
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>TUP ID: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}></Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Name: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}></Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Course: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}></Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Section: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}></Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Setting: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}></Text>
                        </div>
                        <div className="mb-2">
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" style={{ maxWidth: '100%' }}>Time: </Text>
                          <Text className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" strong style={{ maxWidth: '100%' }}></Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
            </Card>
          </Col>

          {/* Secondary content column */}
          <Col xs={{ span: 24 }} sm={{ span: 8 }}>
            <Card className="shadow-md">
              <Row justify="center">
                <Col span={6}>
                  <img
                    src={previousStudentInfo ? previousStudentInfo.student_profile : userImg}
                    alt="Profile"
                    className="mt-2 mb-5 w-14 h-14 rounded-full"
                  />
                </Col>
              </Row>
              <div className="card-body">
                <div>
                  <Text>TUP ID: </Text><Text strong>{previousStudentInfo ? previousStudentInfo.studentInfo_tuptId : ''}</Text><br />
                  <Text>Name: </Text><Text strong>{previousStudentInfo ? `${previousStudentInfo.studentInfo_first_name} ${previousStudentInfo.studentInfo_middle_name} ${previousStudentInfo.studentInfo_last_name}` : ''}</Text><br />
                  <Text>Course: </Text><Text strong>{previousStudentInfo ? previousStudentInfo.studentInfo_course : ''}</Text><br />
                  <Text>Section: </Text><Text strong>{previousStudentInfo ? previousStudentInfo.studentInfo_section : ''}</Text><br />
                  <Text>Setting: </Text><Text strong>{previousSetting}</Text><br />
                  <Text>Time: </Text><Text strong>{previousTime}</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

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
      </div>
    </AntdContent>
  );
};

export default CustomContent;
