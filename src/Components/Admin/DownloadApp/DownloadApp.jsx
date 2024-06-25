import React, { useState } from 'react';
import { Layout, theme  } from 'antd';
import CustomHeader from '../Header';
import MainSidebar from "../MainSidebar";
import DownloadAppContent from './DownloadAppContent';

const DownloadAppPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  return (
    <Layout style={{ minHeight: '100vh' }}>
    <MainSidebar collapsed={collapsed} />
    <Layout style={{ maxHeight: "100vh", overflowY: "auto" }}>
      <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <DownloadAppContent colorBgContainer={colorBgContainer} borderRadiusLG={borderRadiusLG} />
    </Layout>
  </Layout>
  );
};

export default DownloadAppPage;