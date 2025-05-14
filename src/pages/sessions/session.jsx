// src/pages/sessions/session.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

import {fetchPatients, fetchUserById} from "../../services/patient-service";
import { createSession } from "../../services/sessions-service";
import "./session.css";

export default function SessionForm() {
  const [patientsOptions, setPatientsOptions]       = useState([]);
  const [psychologistOption, setPsychologistOption] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Token não encontrado. Faça login.");
        return;
      }

      let userId;
      try {
        userId = Number(jwtDecode(token).sub);
      } catch {
        message.error("Token inválido.");
        return;
      }

      try {
        const patients = await fetchPatients();
        setPatientsOptions(
          patients.map(p => ({value: p.idUser, label: p.name }))
        );
      } catch {
        message.error("Erro ao carregar pacientes.");
      }

      try {
        const user = await fetchUserById(userId);
        setPsychologistOption({ value: userId, label: user.name });
        form.setFieldValue("psychologistId", userId);
      } catch {
        message.error("Erro ao carregar dados do psicólogo.");
      }
    }

    loadData();
  }, [form]);

  const onFinish = async values => {
    const sessionData = {
      patientId:      values.patientId,
      idUser:         values.psychologistId,
      sessionDate:    values.sessionDate.format("YYYY-MM-DD"),
      reason:         values.reason,
      description:    values.description
    };

    try {
      await createSession(sessionData);
      message.success("Sessão criada com sucesso!");
      form.resetFields();
    } catch {
      message.error("Erro ao criar sessão.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form.Item
        label="Paciente"
        name="patientId"
        rules={[{ required: true, message: "Selecione o paciente!" }]}
      >
        <Select
          placeholder="Selecione o paciente"
          options={patientsOptions}
        />
      </Form.Item>

      <Form.Item
        label="Psicólogo"
        name="psychologistId"
        rules={[{ required: true }]}
        initialValue={psychologistOption?.value}
      >
        <Select
          options={psychologistOption ? [psychologistOption] : []}
          disabled
        />
      </Form.Item>

      <Form.Item
        label="Data da Sessão"
        name="sessionDate"
        rules={[{ required: true, message: "Selecione a data da sessão!" }]}
        initialValue={moment()}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Motivo"
        name="reason"
        rules={[{ required: true, message: "Informe o motivo da sessão!" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Descrição" name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Criar Sessão
        </Button>
      </Form.Item>
    </Form>
  );
}