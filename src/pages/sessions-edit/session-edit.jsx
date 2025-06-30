import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  message,
  Modal
} from 'antd';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSessionById, updateSession } from '../../services/sessions-service';
import TreatmentManager from '../../components/TreatmentManager/TreatmentManager';
import FollowupManager from '../../components/FollowupManager/FollowupManager';
import Sidebar from "../../components/sidebar/sidebar";
import './session-edit.css';

export default function SessionEditForm() {
  const [form] = Form.useForm();
  const { idSession } = useParams();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState('');
  const [patientUserId, setPatientUserId] = useState(null);
  const [psychologistOption, setPsychologistOption] = useState(null);
  const [treatmentModalOpen,  setTreatmentModalOpen]  = useState(false);
  const [followupModalOpen,   setFollowupModalOpen]   = useState(false);

  useEffect(() => {
    fetchSessionById(idSession)
      .then(sess => {
        const patientId     = sess.idPatient.idPatient;
        const patientUser   = sess.idPatient.idUser.idUser;
        const patientName   = sess.idPatient.idUser.name;
        const psyOpt        = {
          value: sess.idPsychologist.idPsychologist,
          label: sess.idPsychologist.idUser.name
        };

        setPatientUserId(patientUser);
        setPatientName(patientName);
        setPsychologistOption(psyOpt);

        form.setFieldsValue({
          patientId,
          psychologistId: psyOpt,
          sessionDate:    moment(sess.sessionDate, 'YYYY-MM-DD'),
          reason:         sess.reason,
          description:    sess.description
        });
      })
      .catch(() => message.error('Erro ao carregar dados da sessão.'));
  }, [form, idSession]);

  const onFinish = async values => {
    const payload = {
      patientId:     values.patientId,
      idUser:        values.psychologistId.value,
      sessionDate:   values.sessionDate.format('YYYY-MM-DD'),
      reason:        values.reason,
      description:   values.description
    };
    try {
      await updateSession(idSession, payload);
      message.success('Sessão atualizada com sucesso!');
      navigate(`/sessions-list/${patientUserId}`);
    } catch {
      message.error('Erro ao atualizar sessão.');
    }
  };

  return (
    <div className="session-edit-container">
      <Sidebar />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <h2>Editar Sessão</h2>
        <Form.Item name="patientId" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Paciente">
              <Input value={patientName} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="psychologistId"
              label="Psicólogo"
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
              name="sessionDate"
              label="Data da Sessão"
              rules={[{ required: true, message: 'Selecione a data!' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="reason"
              label="Motivo"
              rules={[{ required: true, message: 'Informe o motivo!' }]}
            >
              <Input.TextArea autoSize={{ minRows: 1 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Descrição da Sessão"
            >
              <Input.TextArea autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Button
              type="default"
              block
              onClick={() => setTreatmentModalOpen(true)}
            >
              Tratamentos
            </Button>
          </Col>
          <Col span={12}>
            <Button
              type="default"
              block
              onClick={() => setFollowupModalOpen(true)}
            >
              Acompanhamentos
            </Button>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 12 }}>
          <Button type="primary" htmlType="submit" block>
            Atualizar Sessão
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
        <TreatmentManager
          patientId={patientUserId}
          onClose={() => setTreatmentModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Acompanhamentos"
        visible={followupModalOpen}
        onCancel={() => setFollowupModalOpen(false)}
        width={600}
        footer={null}
      >
        <FollowupManager
          patientId={patientUserId}
          onClose={() => setFollowupModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
