import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Login from './pages/login/login';
import PatientRegister from './pages/patient-register/patient-register';
import PatientEdit from './pages/patient-edit/patient-edit';
import PatientList from './pages/patient-list/patient-list';
import SessionForm from './pages/sessions/session';
import SessionEdit from './pages/sessions-edit/session-edit';
import SessionList from './pages/sessions-list/session-list';
import AppointmentList from './pages/appointment-list/appointment-list';
import AvailabilityList from './pages/availability-list/availability-list';
import PsychologistList from './pages/psychologist-list/psychologist-list';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route >
          <Route path="/*" element={<Sidebar />} />
          <Route path="/patient-register" element={<div className="app-content"><PatientRegister /></div>} />
          <Route path="/patient-edit/:idUser" element={<div className="app-content"><PatientEdit /></div>} />
          <Route path="/patients" element={<div className="app-content"><PatientList /></div>} />
          <Route path="/sessions" element={<div className="app-content"><SessionForm /></div>} />
          <Route path="/session-edit/:idSession" element={<div className="app-content"><SessionEdit /></div>} />
          <Route path="/sessions-list/:idUser" element={<div className="app-content"><SessionList /></div>} />
          <Route path="/appointments" element={<div className="app-content"><AppointmentList /></div>} />
          <Route path="/psychologists/:idPsychologist/availabilities" element={<div className="app-content"><AvailabilityList /></div>} />
          <Route path="/psychologists" element={<div className="app-content"><PsychologistList /></div>} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}
export default App;
