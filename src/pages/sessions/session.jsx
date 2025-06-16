import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Collapse
} from 'antd';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';

import {
  fetchPatientsByUserId,
  fetchUserById
} from '../../services/patient-service';
import { createSession } from '../../services/sessions-service';
import TreatmentManager from '../../components/TreatmentManager/TreatmentManager';
import FollowupManager  from '../../components/FollowupManager/FollowupManager';

import './session.css';

const { Panel } = Collapse;

export default function SessionForm() {
  const [patientsOptions, setPatientsOptions]       = React.useState([]);
  const [psychologistOption, setPsychologistOption] = React.useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) { message.error('Token não encontrado. Faça login.'); return; }

      let userId;
      try { userId = Number(jwtDecode(token).sub); }
      catch { message.error('Token inválido.'); return; }

      try {
        const patients = await fetchPatientsByUserId();
        setPatientsOptions(patients.map(p => ({
          value: p.idUser,
          label: p.name + " - CPF: " + p.cpf
        })));
      } catch {
        message.error('Erro ao carregar pacientes.');
      }

      try {
        const user = await fetchUserById(userId);
        setPsychologistOption({ value: userId, label: user.name});
        form.setFieldValue('psychologistId', { value: userId, label: user.name});
      } catch {
        message.error('Erro ao carregar dados do psicólogo.');
      }
    })();
  }, [form]);

  const watchedPatient = Form.useWatch('patientId', form);
  const currentPatientId = watchedPatient?.value ?? null;

  const onFinish = async values => {
    const payload = {
      patientId:    values.patientId.value,
      idUser:       values.psychologistId.value,
      sessionDate:  values.sessionDate.format('YYYY-MM-DD'),
      reason:       values.reason,
      description:  values.description
    };
    try {
      await createSession(payload);
      message.success('Sessão criada com sucesso!');
      form.resetFields();
    } catch {
      message.error('Erro ao criar sessão.');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
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

      <Form.Item
        label="Data da Sessão"
        name="sessionDate"
        rules={[{ required: true, message: 'Selecione a data!' }]}
        initialValue={moment()}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Motivo"
        name="reason"
        rules={[{ required: true, message: 'Informe o motivo!' }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Descrição" name="description">
        <Input.TextArea />
      </Form.Item>

      <Collapse style={{ marginTop: 24 }}>
        <Panel header="Tratamentos" key="treatments">
          <TreatmentManager patientId={currentPatientId} />
        </Panel>
      </Collapse>

      <Collapse style={{ marginTop: 12 }}>
        <Panel header="Acompanhamentos" key="followups">
          <FollowupManager patientId={currentPatientId} />
        </Panel>
      </Collapse>

      <Form.Item style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit" block>
          Criar Sessão
        </Button>
      </Form.Item>
    </Form>
  );
}
