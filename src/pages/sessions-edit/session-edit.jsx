import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message, Collapse } from "antd";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSessionById, updateSession } from "../../services/sessions-service";
import TreatmentManager from "../../components/TreatmentManager/TreatmentManager";
import FollowupManager from "../../components/FollowupManager/FollowupManager";

const { Panel } = Collapse;

export default function SessionEditForm() {
  const [form] = Form.useForm();
  const { idSession } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [patientUserId, setPatientUserId] = useState(null);
  const [psychologistOption, setPsychologistOption] = useState(null);

  useEffect(() => {
    (async () => {
      const sess = await fetchSessionById(idSession);
      const patientId = sess.idPatient.idPatient;
      const patientUser = sess.idPatient.idUser.idUser;

      setPatientUserId(patientUser);
      setPatientName(sess.idPatient.idUser.name);

      const psychologistId = sess.idPsychologist.idPsychologist;
      setPsychologistOption({ value: psychologistId, label: sess.idPsychologist.idUser.name });

      // Set the form fields
      form.setFieldsValue({
        patientId,
        psychologistId,
        sessionDate: moment(sess.sessionDate, "YYYY-MM-DD"),
        reason: sess.reason,
        description: sess.description,
      });
    })();
  }, [form, idSession]);

  const onFinish = async (values) => {
    const payload = {
      patientId: values.patientId,
      idUser: values.psychologistId,
      sessionDate: values.sessionDate.format("YYYY-MM-DD"),
      reason: values.reason,
      description: values.description,
    };

    await updateSession(idSession, payload);
    message.success("Sessão atualizada com sucesso!");
    navigate(`/sessions-list/${patientUserId}`);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form.Item name="patientId" hidden>
        <Input />
      </Form.Item>

      <Form.Item label="Paciente">
        <Input value={patientName} disabled />
      </Form.Item>

      <Form.Item label="Psicólogo" name="psychologistId" rules={[{ required: true }]}>
        <Select options={psychologistOption ? [psychologistOption] : []} disabled />
      </Form.Item>

      <Form.Item label="Data da Sessão" name="sessionDate">
        <DatePicker style={{ width: "100%" }} disabled />
      </Form.Item>

      <Form.Item label="Motivo" name="reason" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Descrição" name="description">
        <Input.TextArea />
      </Form.Item>

      <Collapse style={{ marginTop: 24 }}>
        <Panel header="Tratamentos" key="treatments">
          <TreatmentManager patientId={patientUserId} />
        </Panel>
      </Collapse>

      <Collapse style={{ marginTop: 12 }}>
        <Panel header="Acompanhamentos" key="followups">
          <FollowupManager patientId={patientUserId} />
        </Panel>
      </Collapse>

      <Form.Item style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit" block>
          Atualizar Sessão
        </Button>
      </Form.Item>
    </Form>
  );
}
