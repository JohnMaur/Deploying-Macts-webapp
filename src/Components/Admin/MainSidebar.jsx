import React, { useState, useEffect, useContext } from 'react';
import { Menu, Layout } from 'antd';
import { IdcardOutlined, UserAddOutlined, SolutionOutlined, LogoutOutlined, FileDoneOutlined, AppstoreOutlined, MobileOutlined, WifiOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const { adminLogout } = useContext(AuthContext);

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
    adminLogout();
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
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      >
        <Menu.Item key="/dashboard" icon={<AppstoreOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>

        <SubMenu key="Registration" icon={<UserAddOutlined />} title="Faculty Registration">
          <Menu.Item key="/Teacher/Registration">
            <Link to="/Teacher/Registration">Teacher</Link>
          </Menu.Item>
          <Menu.Item key="/Registrar/Registration">
            <Link to="/Registrar/Registration">Registrar</Link>
          </Menu.Item>
          <Menu.Item key="/Librarian/Registration">
            <Link to="/Librarian/Registration">Librarian</Link>
          </Menu.Item>
          <Menu.Item key="/Gym/Registration">
            <Link to="/Gym/Registration">Gym personnel</Link>
          </Menu.Item>
          <Menu.Item key="/Guard/Registration">
            <Link to="/Guard/Registration">Guard</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="Report" icon={<FileDoneOutlined />} title="Report">
          <Menu.Item key="/Gatepass/Report">
            <Link to="/Gatepass/Report">Entrance/Gate</Link>
          </Menu.Item>
          <Menu.Item key="/Registrar/Report">
            <Link to="/Registrar/Report">Registrar</Link>
          </Menu.Item>
          <Menu.Item key="/Gym/Report">
            <Link to="/Gym/Report">Gym</Link>
          </Menu.Item>
          <Menu.Item key="/Library/Report">
            <Link to="/Library/Report">Library</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key="/Attendance" icon={<SolutionOutlined />}>
          <Link to="/Attendance">Attendance</Link>
        </Menu.Item>

        <Menu.Item key="/Registration/RFID" icon={<IdcardOutlined />}>
          <Link to="/Registration/RFID">RFID Registration</Link>
        </Menu.Item>

        <Menu.Item key="/Registration/Device" icon={<IdcardOutlined />}>
          <Link to="/Registration/Device">Device Registration</Link>
        </Menu.Item>

        <Menu.Item key="/Download/mobileApplication" icon={<MobileOutlined />}>
          <Link to="/Download/mobileApplication">Download Mobile App</Link>
        </Menu.Item>

        {/* <Menu.Item key="/Change/configuration" icon={<WifiOutlined />}>
          <Link to="/Change/configuration">Change WiFi Info</Link>
        </Menu.Item> */}

        <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Log out
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
