import React, { useState, useEffect, useContext } from 'react';
import { Menu, Layout } from 'antd';
import { SolutionOutlined, LogoutOutlined, AppstoreOutlined, MobileOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../AuthContext';

const { Sider } = Layout;

const RegistrarSidebar = ({ collapsed }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
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
      trigger={null} collapsible collapsed={collapsed}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        left: 0,
      }}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        selectedKeys={[location.pathname]}
        openKeys={openKeys} // Set openKeys explicitly
        onOpenChange={handleOpenChange}
      >
        <Menu.Item key="/dashboard/Registrar" icon={<AppstoreOutlined />}>
          <Link to="/dashboard/Registrar">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/Facility/Registrar/Report" icon={<SolutionOutlined />}>
          <Link to="/Facility/Registrar/Report">Report</Link>
        </Menu.Item>

        <Menu.Item key="/MobileApp/Link" icon={<MobileOutlined />}>
          <Link to="/MobileApp/Link">Download Mobile App</Link>
        </Menu.Item>
      
        <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Log out
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default RegistrarSidebar;
