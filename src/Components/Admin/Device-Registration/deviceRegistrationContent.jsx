import React from 'react';
import { Layout } from 'antd';
import DeviceTable from './Device-Table';
import DeviceRegistration from './DeviceRegistration';

const { Content: AntdContent } = Layout;

const DeviceRegistrationContent = ({ colorBgContainer, borderRadiusLG }) => {
  return (
    <AntdContent
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        maxHeight: "100vh",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        overflowY: 'auto', 
      }}
    >
      <div >
        <DeviceTable />
        <DeviceRegistration />
      </div>
    </AntdContent>
  );
};

export default DeviceRegistrationContent;