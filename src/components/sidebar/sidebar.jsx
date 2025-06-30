import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h1>Menu</h1>
      <div className="links">
        <ul>
          <li>
            <Link to="/patient-register">Cadastro de Paciente</Link>
          </li>
          <li>
            <Link to="/patients">Lista de Pacientes</Link>
          </li>
          <li>
            <Link to="/sessions">Nova Sessão</Link>
          </li>
          <li>
            <Link to="/appointments">Agendamentos</Link>
          </li>
          <li>
            <Link to="/psychologists">Gestão de Horários</Link>
          </li>
        </ul>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
};

export default Sidebar;
