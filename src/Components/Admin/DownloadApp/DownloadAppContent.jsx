import React from 'react';
import { Layout } from 'antd';
import mobileAppIcon from "../../../assets/Logo_blue.png"

const { Content } = Layout;

const DownloadAppContent = ({ borderRadiusLG, colorBgContainer }) => {
  return (
    <Content
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        maxHeight: "100vh",
        borderRadius: borderRadiusLG,
        background: colorBgContainer,
        overflowX: 'auto',
      }}
    >
      <h1 className='text-xl font-bold text-black mb-2'>Click Link below!</h1>

      <div className='w-80 h-80 rounded-lg bg-slate-50 shadow-xl'>
        <div className='flex justify-center'>
          <img
            src={mobileAppIcon}
            alt="Profile"
            className="w-64 h-64"
          />
        </div>

        <div className='flex justify-center space-x-2'>
          <p className='font-bold text-xl'>MACTs</p>
          <a 
            className='text-xl text-blue-600'
            href='https://expo.dev/accounts/johnmaur8/projects/Macts/builds/54c620db-9aae-4a61-b7c9-b2bcaf92799e' 
            target='_blank' 
            rel='noopener noreferrer
          '>
            Link here
          </a>
        </div>

      </div>

    </Content>
  );
};

export default DownloadAppContent;
