import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import "./patient-register.css";
import { createPatient } from "../../services/patient-service";

const initialState = {
  name: "",
  email: "",
  cpf: "",
  phone: "",
  emergencyContact: "",
  cep: "",
  city: "",
  neighborhood: "",
  street: "",
  number: "",
  complement: "",
  fatherName: "",
  fatherEducation: "",
  fatherAge: "",
  fatherWorkplace: "",
  fatherProfession: "",
  motherName: "",
  motherEducation: "",
  motherAge: "",
  motherWorkplace: "",
  motherProfession: "",
};

const labels = {
  name: "Nome",
  email: "E-mail",
  cpf: "CPF",
  phone: "Telefone",
  emergencyContact: "Contato de Emergência",
  cep: "CEP",
  city: "Cidade",
  neighborhood: "Bairro",
  street: "Rua",
  number: "Número da Casa",
  complement: "Complemento",
  fatherName: "Nome do Pai",
  fatherEducation: "Educação do Pai",
  fatherAge: "Idade do Pai",
  fatherWorkplace: "Local de Trabalho do Pai",
  fatherProfession: "Profissão do Pai",
  motherName: "Nome da Mãe",
  motherEducation: "Educação da Mãe",
  motherAge: "Idade da Mãe",
  motherWorkplace: "Local de Trabalho da Mãe",
  motherProfession: "Profissão da Mãe",
};

export default function PatientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const payload = {
      ...formData,
      fatherAge: formData.fatherAge ? Number(formData.fatherAge) : null,
      motherAge: formData.motherAge ? Number(formData.motherAge) : null,
      type: "PACIENTE",
    };
    try {
      await createPatient(payload);
      navigate("/patients");
      setFormData(initialState);
    } catch {
      setError("Erro ao cadastrar paciente. Verifique os dados e tente novamente.");
    }
  };

  const requiredFields = [
    "name","email","cpf","phone","emergencyContact",
    "cep","city","neighborhood","street","number"
  ];

  return (
    <div className="patient-register-container">
      <Sidebar />
      <div className="patient-register-content">
        <h2>Cadastro de Paciente</h2>
        <form className="patient-register-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {Object.keys(initialState).map(key => (
            <div className="patient-form-group" key={key}>
              <label htmlFor={key}>{labels[key]}:</label>
              <input
                id={key}
                name={key}
                type={["fatherAge","motherAge"].includes(key) ? "number" : "text"}
                value={formData[key]}
                onChange={handleChange}
                required={requiredFields.includes(key)}
              />
            </div>
          ))}
          <div className="button-group">
            <button type="submit" className="register-button">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
