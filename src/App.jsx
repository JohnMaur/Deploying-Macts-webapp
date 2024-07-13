import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Admin Route

// Login route
import AdminLogin from './Components/Login-Admin';
import FacultyLogin from './Components/FacultyLogin';
import Admin_landingPage from './Components/Admin/Admin_landingPage';

// Admin Registration route
import Teacher from './Components/Admin/Registration-pages/Teacher-registration';
import Registrar from './Components/Admin/Registration-pages/Registrar-registration';
import Librarian from './Components/Admin/Registration-pages/Librarian-registration';
import Gym from './Components/Admin/Registration-pages/Gym-registration';
import Guard from './Components/Admin/Registration-pages/Guard-registration';

// Admin Attendance route
import AttendancePage from './Components/Admin/Attendance/Attendancen-page';
import AttendancePageReport from './Components/Admin/Attendance/Report/Attendance-page-report';

import RFID_page from './Components/Admin/RFID-Registratration/RFID-Page';
import DevicePageRegistration from './Components/Admin/Device-Registration/Device-page';
import WifiLandingPage from './Components/Admin/ChangeWifi/Wifi-landingPage';

// Admin Report Route
import AdminLibraryReport from './Components/Admin/Report/Library/Library-page';
import AdminGymReport from './Components/Admin/Report/Gym/Gym-page';
import AdminRegistrarReport from './Components/Admin/Report/Registrar/Registrar-page';
import AdminGatepassReport from './Components/Admin/Report/Gatepass/Gatepass-page';

import DownloadAppPage from './Components/Admin/DownloadApp/DownloadApp';

// Teacher import
import Teacher_landingPage from './Components/Faculty/Teacher/Teacher-landingPage';
import FacultyAddAttendancePage from './Components/Faculty/Teacher/AddAttendancePage';
import FacultyAttendancePageReport from './Components/Faculty/Teacher/Report/Attendance-page-report';
import Teacher_RFID_page from './Components/Faculty/Teacher/Teacher-RFID-Registration';
import TeacherDownloadApp from './Components/Faculty/Teacher/Teacher-MobileAppPage';
import TeacherChangeWifi from './Components/Faculty/Teacher/TeacherChangeWifi';

// Librarian import
import Librarian_landingPage from './Components/Faculty/Librarian/Librarian_landing_page';
import LibraryReport from './Components/Faculty/Librarian/Libraray_Report';
import LibraryDownloadApp from './Components/Faculty/Librarian/Library-mobileApp';

// Gym import
import GymLandingPage from './Components/Faculty/Gym/Gym_landingPage';
import GymReport from './Components/Faculty/Gym/Gym_Report';
import GymDownloadApp from './Components/Faculty/Gym/Gym-MobileApp';

// Guard import
import GuardLandingPage from './Components/Faculty/Guard/Guard_ladingPage';
import GuardReport from './Components/Faculty/Guard/Guard_Report';
import GatepassMobileApp from './Components/Faculty/Guard/Guard-MobileApp';

// Registrar import
import RegistrarLandingPage from './Components/Faculty/Registar/Registrar_landingPage';
import RegistrarReport from './Components/Faculty/Registar/RegistrarReport';
import RegistrarMobileApp from './Components/Faculty/Registar/Registrar-MobileApp';


function App() {

  return (
    <Routes>
      <Route path="/login/admin" element={<AdminLogin />} />

      // Admin Route
      <Route path="/dashboard" element={<ProtectedRoute element={Admin_landingPage} />} />

      <Route path="/Teacher/Registration" element={<ProtectedRoute element={Teacher} />} />
      <Route path="/Registrar/Registration" element={<ProtectedRoute element={Registrar} />} />
      <Route path="/Librarian/Registration" element={<ProtectedRoute element={Librarian} />} />
      <Route path="/Gym/Registration" element={<ProtectedRoute element={Gym} />} />
      <Route path="/Guard/Registration" element={<ProtectedRoute element={Guard} />} />

      // Attendance route AttendancePage
      <Route path="/Attendance" element={<ProtectedRoute element={AttendancePage} />} />
      <Route path="/attendance/report/:attendance_code" element={<ProtectedRoute element={AttendancePageReport} />} />

      // Admin Report Route
      <Route path="/Library/Report" element={<ProtectedRoute element={AdminLibraryReport} />} />
      <Route path="/Gym/Report" element={<ProtectedRoute element={AdminGymReport} />} />
      <Route path="/Registrar/Report" element={<ProtectedRoute element={AdminRegistrarReport} />} />
      <Route path="/Gatepass/Report" element={<ProtectedRoute element={AdminGatepassReport} />} />

      <Route path="/Registration/RFID" element={<ProtectedRoute element={RFID_page} />} />
      <Route path="/Registration/Device" element={<ProtectedRoute element={DevicePageRegistration} />} />
      <Route path="/Change/configuration" element={<ProtectedRoute element={WifiLandingPage} />} />

      <Route path="/Download/mobileApplication" element={<ProtectedRoute element={DownloadAppPage} />} />

      // Faculty login
      <Route path="/" element={<FacultyLogin />} />

      // Teacher Route
      <Route path="/dashboard/Teacher/:userId" element={<ProtectedRoute element={Teacher_landingPage} />} />
      <Route path="/Add/Attendance/:userId" element={<ProtectedRoute element={FacultyAddAttendancePage} />} />
      <Route path="/attendance_report/:attendance_code/:userId" element={<ProtectedRoute element={FacultyAttendancePageReport} />} />
      <Route path="Faculty/RFID_Registration/:userId" element={<ProtectedRoute element={Teacher_RFID_page} />} />
      <Route path="Faculty/MobileApp/:userId" element={<ProtectedRoute element={TeacherDownloadApp} />} />
      <Route path="Teacher/Wificonfig/:userId" element={<ProtectedRoute element={TeacherChangeWifi} />} /> 

      // Librarian Route
      <Route path="/dashboard/Library" element={<ProtectedRoute element={Librarian_landingPage} />} />
      <Route path="/Facility/Library/Report" element={<ProtectedRoute element={LibraryReport} />} />
      <Route path="/Library/Mobile/link" element={<ProtectedRoute element={LibraryDownloadApp} />} />

      // Gym Route
      <Route path="/dashboard/Gym" element={<ProtectedRoute element={GymLandingPage} />} />
      <Route path="/Facility/Gym/Report" element={<ProtectedRoute element={GymReport} />} />
      <Route path="/Gym/Mobile/link" element={<ProtectedRoute element={GymDownloadApp} />} />
    
      // Guard Route
      <Route path="/dashboard/Gatepass" element={<ProtectedRoute element={GuardLandingPage} />} />
      <Route path="/Facility/Gatepass/Report" element={<ProtectedRoute element={GuardReport} />} />
      <Route path="/Gatepass/MobileApp/link" element={<ProtectedRoute element={GatepassMobileApp} />} />

      // Registrar Route
      <Route path="/dashboard/Registrar" element={<ProtectedRoute element={RegistrarLandingPage} />} />
      <Route path="/Facility/Registrar/Report" element={<ProtectedRoute element={RegistrarReport} />} />
      <Route path="/MobileApp/Link" element={<ProtectedRoute element={RegistrarMobileApp} />} />
    
    </Routes>
  );
}

export default App;