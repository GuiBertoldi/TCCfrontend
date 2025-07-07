import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, DatePicker, Select, message, Modal } from 'antd';
import dayjs from 'dayjs';
import {jwtDecode} from 'jwt-decode';
import { fetchPatientsByUserId, fetchUserById } from '../../services/patient-service';
import { createSession } from '../../services/sessions-service';
import TreatmentManager from '../../components/TreatmentManager/TreatmentManager';
import FollowupManager from '../../components/FollowupManager/FollowupManager';
import Sidebar from "../../components/sidebar/sidebar";
import './session.css';

export default function SessionForm() {
  const [form] = Form.useForm();
  const [patientsOptions, setPatientsOptions] = useState([]);
  const [psychologistOption, setPsychologistOption] = useState(null);
  const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);
  const [followupModalOpen, setFollowupModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      message.error('Token não encontrado. Faça login.');
      return;
    }
    let userId;
    try {
      userId = Number(jwtDecode(token).sub);
    } catch {
      message.error('Token inválido.');
      return;
    }

    (async () => {
      try {
        const patients = await fetchPatientsByUserId();
        setPatientsOptions(
          patients.map(p => ({ value: p.idUser, label: `${p.name} - CPF: ${p.cpf}` }))
        );
      } catch {
        message.error('Erro ao carregar pacientes.');
      }

      try {
        const user = await fetchUserById(userId);
        const opt = { value: userId, label: user.name };
        setPsychologistOption(opt);
        form.setFieldsValue({ psychologistId: opt });
      } catch {
        message.error('Erro ao carregar dados do psicólogo.');
      }
    })();
  }, [form, token]);

  const watchedPatient = Form.useWatch('patientId', form);
  const currentPatientId = watchedPatient?.value ?? null;

  const onFinish = async values => {
    const payload = {
      patientId: values.patientId.value,
      idUser: values.psychologistId.value,
      sessionDate: values.sessionDate.format('YYYY-MM-DD'),
      reason: values.reason,
      description: values.description
    };
    try {
      await createSession(payload);
      message.success('Sessão criada com sucesso!');
      form.resetFields();
      navigate("/patients");
    } catch {
      message.error('Erro ao criar sessão.');
    }
  };

  return (
    <div>
      <Sidebar />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className= "session-container"
      >
        <h2>Nova Sessão</h2>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Paciente"
              name="patientId"
              rules={[{ required: true, message: 'Selecione o paciente!' }]}
            >
              <Select
                showSearch
                labelInValue
                placeholder="Selecione o paciente"
                options={patientsOptions}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Psicólogo"
              name="psychologistId"
              rules={[{ required: true }]}
            >
              <Select
                labelInValue
                options={psychologistOption ? [psychologistOption] : []}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Data da Sessão"
              name="sessionDate"
              initialValue={dayjs()}
              rules={[{ required: true, message: 'Selecione a data!' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="Motivo"
              name="reason"
              rules={[{ required: true, message: 'Informe o motivo!' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Descrição da Sessão" name="description">
              <Input.TextArea autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Button type="default" block onClick={() => setTreatmentModalOpen(true)}>
              Tratamentos
            </Button>
          </Col>
          <Col span={12}>
            <Button type="default" block onClick={() => setFollowupModalOpen(true)}>
              Acompanhamentos
            </Button>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 12 }}>
          <Button type="primary" htmlType="submit" block>
            Criar Sessão
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Tratamentos"
        visible={treatmentModalOpen}
        onCancel={() => setTreatmentModalOpen(false)}
        width={600}
        footer={null}
      >
        <TreatmentManager patientId={currentPatientId} onClose={() => setTreatmentModalOpen(false)} />
      </Modal>

      <Modal
        title="Acompanhamentos"
        visible={followupModalOpen}
        onCancel={() => setFollowupModalOpen(false)}
        width={600}
        footer={null}
      >
        <FollowupManager patientId={currentPatientId} onClose={() => setFollowupModalOpen(false)} />
      </Modal>
    </div>
  );
}
