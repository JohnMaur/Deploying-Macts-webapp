import React, { useState, useEffect, useContext } from 'react';
import { Menu, Layout } from 'antd';
import { IdcardOutlined, SolutionOutlined, LogoutOutlined, AppstoreOutlined, MobileOutlined, WifiOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../AuthContext';

const { Sider } = Layout;

const TeacherSidebar = ({ collapsed }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const userId = location.pathname.split('/')[3]; 
  const { facultyLogout } = useContext(AuthContext);

  // Function to handle submenu open keys
  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  useEffect(() => {
    // Get the current path from location
    const currentPath = location.pathname;
    // Extract the submenu key from the path
    const submenuKey = currentPath.split('/')[2];
    // Update the openKeys state with the submenu key
    setOpenKeys(submenuKey ? [submenuKey] : []);
  }, [location.pathname]);

  const handleLogout = () => {
    facultyLogout();
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        left: 0,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        selectedKeys={[location.pathname]}
        openKeys={openKeys} // Set openKeys explicitly
        onOpenChange={handleOpenChange}
      >
        <Menu.Item key={`/dashboard/Teacher/${userId}`} icon={<AppstoreOutlined />}>
          <Link to={`/dashboard/Teacher/${userId}`}>Dashboard</Link>
        </Menu.Item>

        <Menu.Item key={`/Add/Attendance/${userId}`} icon={<SolutionOutlined />}>
          <Link to={`/Add/Attendance/${userId}`}>ADD Attendance</Link>
        </Menu.Item>

        <Menu.Item key={`/Faculty/RFID_Registration/${userId}`} icon={<IdcardOutlined />}>
          <Link to={`/Faculty/RFID_Registration/${userId}`}>RFID Registration</Link>
        </Menu.Item>

        {/* <Menu.Item key="/Teacher/Wificonfig/:userId" icon={<WifiOutlined />}>
          <Link to="/Teacher/Wificonfig/:userId">Change WiFi Info</Link>
        </Menu.Item> */}

        <Menu.Item key={`/Faculty/MobileApp/${userId}`} icon={<MobileOutlined />}>
          <Link to={`/Faculty/MobileApp/${userId}`}>Download Mobile App</Link>
        </Menu.Item>

        <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Log out
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default TeacherSidebar;
