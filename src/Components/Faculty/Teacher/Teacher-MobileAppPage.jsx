import React, { useState } from 'react';
import { Layout, theme  } from 'antd';
import CustomHeader from '../../Admin/Header';
import TeacherSidebar from './Teacher-Sidebar';
import DownloadAppContent from '../../Admin/DownloadApp/DownloadAppContent';

const TeacherDownloadApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  return (
    <Layout style={{ minHeight: '100vh' }}>
    <TeacherSidebar collapsed={collapsed} />
    <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
      <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <DownloadAppContent colorBgContainer={colorBgContainer} borderRadiusLG={borderRadiusLG} />
    </Layout>
  </Layout>
  );
};

export default TeacherDownloadApp;