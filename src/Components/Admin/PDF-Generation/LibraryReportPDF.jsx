import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import tupLogo from '../../../assets/tupLogo.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: '10mm 15mm',
    fontFamily: 'Helvetica',
  },
  headerLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  tuplogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  tupheader: {
    color: '#9D192E',
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.7,
  },
  tupsubheader: {
    fontSize: 14,
    color: '#9D192E',
    textAlign: 'center',  
    marginTop: 0,
    opacity: 0.7,
  },
  MactsTitle: {
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  MactsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  settingSubject: {
    marginLeft: 10,
    marginTop: 30,
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    padding: 10,
    backgroundColor: '#fff',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 10,
  },
  tableCol: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: 'center',
  },
  tableCol1: {
    width: '5%',
  },
  tableCol2: {
    width: '16%',
  },
  tableCol3: {
    width: '21%',
  },
  tableCol4: {
    width: '16%',
  },
  tableCol5: {
    width: '10%',
  },
  tableCol6: {
    width: '16%',
  },
  tableCol7: {
    width: "16%"
  },
});

const LibraryReportPDF = ({ data, selectedDate }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No data available</Text>
        </Page>
      </Document>
    );
  }

  // Sort data based on lastname in ascending order
  const sortedData = data.sort((a, b) => {
    if (a.library_lastName < b.library_lastName) return -1;
    if (a.library_lastName > b.library_lastName) return 1;
    return 0;
  });

  const tableData = sortedData.map((item, index) => [
    index + 1,  // Auto-increment number
    item.library_tupId,
    `${item.library_lastName}, ${item.library_firstName} ${item.library_middleName}`,
    item.library_course,
    item.library_section,
    item.library_InHistoryDate,
    item.library_OutHistoryDate,
  ]);

  const tableHeader = ['No', 'TUPT ID', 'Name', 'Course', 'Section', 'Time In', 'Time Out'];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerLayout}>
          <Image style={styles.tuplogo} src={tupLogo} />
          <View>
            <Text style={styles.tupheader}>Technological University of the Philippines</Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.tupsubheader}>Taguig Campus</Text>
            </View>
          </View>
        </View>

        <View style={styles.MactsTitle}>
          <Text style={styles.MactsHeader}>MULTIFUNCTIONAL ACCESS AND CONTROL TRACKING</Text>
          <Text style={styles.MactsHeader}>SYSTEM TABLE</Text>
        </View>

        <Text style={styles.settingSubject}>
          LIBRARY TIME IN/OUT DAILY RECORD - {new Date(selectedDate).toLocaleDateString()}
        </Text>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {tableHeader.map((col, colIndex) => (
                <View key={colIndex} style={[styles.tableCol, styles[`tableCol${colIndex + 1}`]]}>
                  <Text style={styles.text}>{col}</Text>
                </View>
              ))}
            </View>
            {tableData.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {row.map((col, colIndex) => (
                  <View key={colIndex} style={[styles.tableCol, styles[`tableCol${colIndex + 1}`]]}>
                    <Text style={styles.text}>{col}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default LibraryReportPDF;
