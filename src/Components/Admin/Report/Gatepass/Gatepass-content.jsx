import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import GatepassTable from './Gatepass-Table';
import GatepassPDF from '../../PDF-Generation/GatepassReportPDF';
 
const { Content: AntdContent } = Layout;

const GatepassContent = ({ colorBgContainer, borderRadiusLG }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = (date) => {
    setLoading(true);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    fetch(`https://macts-backend-webapp-production-0bd2.up.railway.app/Gatepass-Report/pdf?date=${formattedDate}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

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
        <GatepassTable />
      </div>

      <div className="mb-6">
        <div className="mb-4 text-sm text-gray-500">
          Select a date to download gatepass records. You can change the date as needed.
        </div>
        <div className="flex items-center">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          data && (
            <PDFDownloadLink
              document={<GatepassPDF data={data} selectedDate={selectedDate} />}
              fileName="Gatepass-report.pdf"
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

export default GatepassContent;