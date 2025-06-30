import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, Button } from "antd";
import "./patient-search.css";

const PatientSearch = ({ onSearch }) => {
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");

  const handleSearch = () => {
    onSearch({ cpf, name });
  };

  return (
    <div className="patient-search">
      <h2>Pesquisar Paciente</h2>
      <Input
        placeholder="Buscar por CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Buscar por Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Button type="primary" onClick={handleSearch}>
        Buscar
      </Button>
    </div>
  );
};

PatientSearch.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default PatientSearch;
