import React, { useState ,useEffect} from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar";
import "./patient-edit.css";
import { useParams ,useNavigate} from "react-router-dom";
import { api } from "../../services/patient-service";

const PatientEdit = () => {
  const {idUser} = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
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
  });

  const [error, setError] = useState("");

  useEffect( () => {
    if (!idUser) return;
    const fetcUser = async () => {
      const response = await api.get(`/patients/search/${idUser}`);
      const newFormData ={...response.data,...response.data.idUser}
      setFormData(newFormData)
      
    }
    fetcUser();
    
  }, [idUser])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const patientData = {
      ...formData,
      type: "PACIENTE",
    };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token de autenticação não encontrado.");
        return;
      }

      const response = await api.put(`http://localhost:8080/patients/${patientData.idPatient}`, patientData);

      alert("Paciente editado com sucesso!");
      setFormData({
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
      });
      navigate("/patients");
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      setError("Erro ao cadastrar paciente. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="patient-register-container">
      <Sidebar />
      <div className="patient-register-content">
        <h2>Editar Paciente</h2>
        <form className="patient-register-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <div className="patient-form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="patient-form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="patient-form-group">
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </div>

          <div className="patient-form-group">
            <label htmlFor="phone">Telefone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="patient-form-group">
            <label htmlFor="emergencyContact">Contato de Emergência:</label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="patient-form-group">
            <label htmlFor="cep">CEP:</label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              required
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="city">Cidade:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="neighborhood">Bairro:</label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              required
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="street">Rua:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="number">Número da Casa:</label>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="complement">Complemento:</label>
            <input
              type="text"
              id="complement"
              name="complement"
              value={formData.complement}
              onChange={handleChange}
            />
          </div>

          <div className="patient-form-group">
            <label htmlFor="fatherName">Nome do Pai:</label>
            <input
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="fatherEducation">Educação do Pai:</label>
            <input
              type="text"
              id="fatherEducation"
              name="fatherEducation"
              value={formData.fatherEducation}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="fatherAge">Idade do Pai:</label>
            <input
              type="number"
              id="fatherAge"
              name="fatherAge"
              value={formData.fatherAge}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="fatherWorkplace">Local de Trabalho do Pai:</label>
            <input
              type="text"
              id="fatherWorkplace"
              name="fatherWorkplace"
              value={formData.fatherWorkplace}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="fatherProfession">Profissão do Pai:</label>
            <input
              type="text"
              id="fatherProfession"
              name="fatherProfession"
              value={formData.fatherProfession}
              onChange={handleChange}
            />
          </div>

          <div className="patient-form-group">
            <label htmlFor="motherName">Nome da Mãe:</label>
            <input
              type="text"
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="motherEducation">Educação da Mãe:</label>
            <input
              type="text"
              id="motherEducation"
              name="motherEducation"
              value={formData.motherEducation}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="motherAge">Idade da Mãe:</label>
            <input
              type="number"
              id="motherAge"
              name="motherAge"
              value={formData.motherAge}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="motherWorkplace">Local de Trabalho da Mãe:</label>
            <input
              type="text"
              id="motherWorkplace"
              name="motherWorkplace"
              value={formData.motherWorkplace}
              onChange={handleChange}
            />
          </div>
          <div className="patient-form-group">
            <label htmlFor="motherProfession">Profissão da Mãe:</label>
            <input
              type="text"
              id="motherProfession"
              name="motherProfession"
              value={formData.motherProfession}
              onChange={handleChange}
            />
          </div>

          <div className="button-group">
            {/* <button onClick={onClick} className="register-button">
              Cancelar
            </button> */}
            <button type="submit" className="register-button">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientEdit;