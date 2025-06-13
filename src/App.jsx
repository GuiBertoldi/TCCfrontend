import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import Login from "./pages/login/login";
import PatientRegister from "./pages/patient-register/patient-register";
import PatientEdit from "./pages/patient-edit/patient-edit";
import PatientList from "./pages/patient-list/patient-list";
import PatientDetails from "./pages/patient-details/patient-details";
import ProtectedRoute from "./components/protected-route";
import SessionForm from "./pages/sessions/session";
import SessionEdit from "./pages/sessions-edit/session-edit";
import SessionList from "./pages/sessions-list/session-list";
import AppointmentList from "./pages/appointment-list/appointment-list";
import AvailabilityList from "./pages/availability-list/availability-list";
import PsychologistList from "./pages/psychologist-list/psychologist-list";
import ptBR from "antd/es/locale/pt_BR";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Sidebar />} />
        <Route
          path="/"
          element={
            <div>
              <h1>Bem-vindo ao Sistema</h1>
              <p>Esta é a página inicial. Use o menu acima para navegar.</p>
            </div>
          }
        />
      </Routes>

      <Routes>
        <ProtectedRoute>
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/patient-edit/:idUser" element={<PatientEdit />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patient-details/:id" element={<PatientDetails />} />
          <Route path="/sessions" element={<SessionForm />} />
          <Route path="/session-edit/:idSession" element={<SessionEdit />} />
          <Route path="/sessions-list/:idUser" element={<SessionList />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/psychologists/:idPsychologist/availabilities" element={<AvailabilityList />} />
          <Route path="/psychologists" element={<PsychologistList />} />
        </ProtectedRoute>
      </Routes>
    </ConfigProvider>
  );
}

export default App;
