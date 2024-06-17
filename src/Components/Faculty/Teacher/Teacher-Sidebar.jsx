import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import { IdcardOutlined, SolutionOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const TeacherSidebar = ({ collapsed }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const userId = location.pathname.split('/')[3]; // Extract the userId from the path

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

        {/* <Menu.Item key={`/RFID_Registration/${userId}`} icon={<IdcardOutlined />}>
          <Link to={`/RFID_Registration/${userId}`}>RFID Registration</Link>
        </Menu.Item> */}

        <Menu.Item key="/login" icon={<LogoutOutlined />}>
          <Link to="/login">Log out</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default TeacherSidebar;
