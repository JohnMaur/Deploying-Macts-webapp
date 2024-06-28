import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from '../../Admin/Header';
import TeacherSidebar from './Teacher-Sidebar';
import TeacherContent from './Teacher-content';

const Teacher_landingPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <TeacherSidebar collapsed={collapsed} />
      <Layout style={{ maxHeight: '100vh', overflowY: "auto" }}>
        <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <TeacherContent/>
      </Layout>
    </Layout>
  );
};

export default Teacher_landingPage;