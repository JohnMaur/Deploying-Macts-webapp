import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import AttendanceReportTable from './Attendance-report-table';
import AttendanceReportPDF from '../../PDF-Generation/AttendanceReportPDF';
import ManualAddingAttendancePage from './ManualAddingPage';
import AttendanceCodeSolo from './AttendanceCode/AttendanceCodeSolo';
import axios from 'axios';  // Import axios for making HTTP requests

const { Content: AntdContent } = Layout;

const AttendanceReport = ({ colorBgContainer, borderRadiusLG }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { attendance_code } = useParams(); // Extract attendance_code from the URL parameters

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://macts-backend-webapp-production-0bd2.up.railway.app/attendance/report/${attendance_code}`);
      const fetchedData = response.data;

      // Filter out duplicate records based on attendance_tupId
      const uniqueData = fetchedData.reduce((acc, current) => {
        const x = acc.find(item => item.attendance_tupId === current.attendance_tupId);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setData(uniqueData);
      console.log("fetchData", uniqueData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 30 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [attendance_code]);

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
        overflowX: "auto",
      }}
    >
      <div className="mb-6">
        <AttendanceReportTable />
        <div className='my-5 w-full'>
          <AttendanceCodeSolo />
          
        </div>
 
        <div className='my-5 shadow-md p-5 w-1/3 rounded-md'>
          <p className='mb-2'>Manually Adding Attendance</p>
          <ManualAddingAttendancePage />
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          data && (
            <PDFDownloadLink
              document={<AttendanceReportPDF data={data} />} // Pass data to PDF component
              fileName="Attendance-report.pdf"
              className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Preparing document...' : 'Download PDF'
              }
            </PDFDownloadLink>
          )
        )}
      </div>
    </AntdContent>
  );
};

export default AttendanceReport;
