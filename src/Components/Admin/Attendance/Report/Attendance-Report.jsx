import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import AttendanceReportTable from './Attendance-report-table';
import AttendanceReportPDF from '../../PDF-Generation/AttendanceReportPDF';
import ManualAddingAttendancePage from './ManualAddingPage';

const { Content: AntdContent } = Layout;

const AttendanceReport = ({ colorBgContainer, borderRadiusLG }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { attendance_code } = useParams(); // Extract attendance_code from the URL parameters

  // Function to fetch data from the backend
  const fetchData = (date) => {
    setLoading(true); // Set loading state to true
    const formattedDate = moment(date).format('YYYY-MM-DD'); // Format the selected date
    fetch(`https://macts-backend-webapp.onrender.com/Attendance-Report/pdf?date=${formattedDate}&attendance_code=${attendance_code}`) // Fetch data from the API
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
        setData(data); // Set the data to state
        setLoading(false); // Set loading state to false
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Handle errors
        setLoading(false); // Set loading state to false
      });
  };

  // Use effect to fetch data when selectedDate or attendance_code changes
  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate, attendance_code]);

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
        <ManualAddingAttendancePage />
      </div>

      <div className="mb-6">
        <div className="mb-4 text-sm text-gray-500">
          Select a date to download attendance records. You can change the date as needed.
        </div>
        <div className="flex items-center">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)} // Set selected date
            className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500 z-[10000]"
          />
        </div>
      </div>

      <div className="mb-6">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          data && (
            <PDFDownloadLink
              document={<AttendanceReportPDF data={data} selectedDate={selectedDate} />} // Pass data to PDF component
              fileName="Attendance-report.pdf"
              className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
            >
              {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
          )
        )}
      </div>
      
    </AntdContent>
  );
};

export default AttendanceReport;
