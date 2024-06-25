import React, { useState } from 'react';
import { Layout, theme  } from 'antd';
import CustomHeader from '../../Admin/Header';
import GymSidebar from './Gym_sidebar';
import DownloadAppContent from '../../Admin/DownloadApp/DownloadAppContent';

const GymDownloadApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  return (
    <Layout style={{ minHeight: '100vh' }}>
    <GymSidebar collapsed={collapsed} />
    <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
      <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <DownloadAppContent colorBgContainer={colorBgContainer} borderRadiusLG={borderRadiusLG} />
    </Layout>
  </Layout>
  );
};

export default GymDownloadApp;