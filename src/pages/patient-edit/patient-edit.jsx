import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import "./patient-edit.css";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPatientById, updatePatient } from "../../services/patient-service";

const initialState = {
  idPatient:        "",
  name:             "",
  email:            "",
  cpf:              "",
  phone:            "",
  emergencyContact: "",
  cep:              "",
  city:             "",
  neighborhood:     "",
  street:           "",
  number:           "",
  complement:       "",
  fatherName:       "",
  fatherEducation:  "",
  fatherAge:        "",
  fatherWorkplace:  "",
  fatherProfession: "",
  motherName:       "",
  motherEducation:  "",
  motherAge:        "",
  motherWorkplace:  "",
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
  number: "Número",
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

export default function PatientEdit() {
  const { idUser } = useParams();
  const navigate   = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!idUser) return;
    fetchPatientById(idUser)
      .then(data => {
        const u = data.idUser || {};
        const flat = Object.keys(initialState).reduce((acc, key) => {
          if (key === "idPatient") {
            acc[key] = data.idPatient ?? "";
          } else if (data.hasOwnProperty(key)) {
            acc[key] = data[key] != null ? String(data[key]) : "";
          } else {
            acc[key] = u[key] != null ? String(u[key]) : "";
          }
          return acc;
        }, {});
        setFormData(flat);
      })
      .catch(() => setError("Não foi possível carregar os dados"));
  }, [idUser]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const payload = {
      ...formData,
      fatherAge:   formData.fatherAge ? Number(formData.fatherAge) : null,
      motherAge:   formData.motherAge ? Number(formData.motherAge) : null,
      type:        "PACIENTE",
    };
    try {
      await updatePatient(formData.idPatient, payload);
      navigate("/patients");
    } catch {
      setError("Erro ao salvar alterações. Verifique os dados.");
    }
  };

  return (
    <div className="patient-register-container">
      <Sidebar />
      <div className="patient-register-content">
        <h2>Editar Paciente</h2>
        <form className="patient-register-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {Object.keys(initialState).map(key =>
            key !== "idPatient" && (
              <div className="patient-form-group" key={key}>
                <label htmlFor={key}>{labels[key]}:</label>
                <input
                  id={key}
                  name={key}
                  type={["fatherAge","motherAge"].includes(key) ? "number" : "text"}
                  value={formData[key]}
                  onChange={handleChange}
                  required={["name","email","cpf","phone","emergencyContact","cep","city","neighborhood","street","number"].includes(key)}
                />
              </div>
            )
          )}
          <div className="button-group">
            <button type="submit" className="register-button">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
