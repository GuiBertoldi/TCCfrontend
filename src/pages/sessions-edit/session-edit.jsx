import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import axios from "axios";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { fetchPatients, api } from "../../services/patient-service";
import "./session-edit.css";

const { Option } = Select;

const SessionEdit = () => {
  const [patients, setPatients] = useState([]);
  const [form] = Form.useForm();
  const [psychologistOption, setPsychologistOption] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          message.error("Token não encontrado. O usuário precisa estar logado.");
          return;
        }

        const decodedToken = jwtDecode(token);  
        const patientsResponse = await fetchPatients();
        if (Array.isArray(patientsResponse)) {
          setPatients(patientsResponse);
        } else {
          message.error("Formato de dados de pacientes inválido.");
        }
        console.log(decodedToken);
        

        return Number(decodedToken.sub);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        message.error("Erro ao carregar dados.");
      }
    };

    const fetchUser = async (idUser) => {
      const { data } = await api.get(`/users/search/${idUser}`);
      console.log(data);
      
      const { name } = data;
      form.setFieldValue("psychologistId", idUser);
      setPsychologistOption([{value:idUser, label:name}]);
    }

    fetchData().then((idUser) => {
      fetchUser(idUser);
    });
  }, []);

  const handleSubmit = async (values) => {
    try {
      const sessionData = {
        patientId: values.patientId,
        idUser: psychologistOption[0].value,
        sessionDate: values.sessionDate.format("YYYY-MM-DD"),
        reason: values.reason,
        description: values.description,
      };
      await api.post("/sessions", sessionData);
      message.success("Sessão criada com sucesso!");
      form.resetFields();
    } catch (error) {
      message.error("Erro ao criar sessão.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form.Item
        label="Paciente"
        name="patientId"
        rules={[{ required: true, message: "Selecione o paciente!" }]}
      >
        <Select placeholder="Selecione o paciente">
        
        </Select>
      </Form.Item>

      <Form.Item
        label="Psicólogo"
        name="psychologistId"
        rules={[{ required: true, message: "Selecione o psicólogo!" }]}
        initialValue={psychologistOption[0]?.value}
      >
        <Select options={psychologistOption} disabled>
        </Select>
      </Form.Item>

      <Form.Item
        label="Data da Sessão"
        name="sessionDate"
        rules={[{ required: true, message: "Selecione a data da sessão!" }]}
        initialValue={moment()
       }
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Motivo"
        name="reason"
        rules={[{ required: true, message: "Informe o motivo da sessão!" }]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Descrição"
        name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Salvar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SessionEdit;