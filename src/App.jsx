import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import "./App.css";
import Sidebar from "./components/sidebar/index";
import Login from "./pages/login/index";
import PatientRegister from "./pages/patient-register/index";
import PatientEdit from "./pages/patient-edit/index";
import PatientList from "./pages/patient-list/index";
import PatientDetails from "./pages/patient-details/index";
import ProtectedRoute from "./components/protected-route";
import SessionForm from "./pages/sessions/session";
import SessionEdit from "./pages/sessions-edit/session-edit";
import SessionList from "./pages/sessions-list/session-list";
import moment from "moment";
import ptBR from "antd/es/locale/pt_BR";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider locale={ptBR}>
    <Router>
        <Routes>
          <Route
            path="/login"
          />
          <Route path="/*" element={<Sidebar />} />
        </Routes>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>Bem-vindo ao Sistema</h1>
                  <p>Esta é a página inicial. Use o menu acima para navegar.</p>
                </div>
              }
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/patient-register"
              element={
                <ProtectedRoute>
                  <PatientRegister />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-edit/:idUser"
              element={
                <ProtectedRoute>
                  <PatientEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-details/:id"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/sessions" 
              element={
                <ProtectedRoute>
                  <SessionForm/>
                </ProtectedRoute>
                } 
              />
              <Route 
              path="/sessions-edit" 
              element={
                <ProtectedRoute>
                  <SessionEdit/>
                </ProtectedRoute>
                } 
              />
              <Route 
              path="/sessions-list" 
              element={
                <ProtectedRoute>
                  <SessionList/>
                </ProtectedRoute>
                } 
              />
          </Routes>
      </Router>
  </ConfigProvider>
  );
}

export default App;
