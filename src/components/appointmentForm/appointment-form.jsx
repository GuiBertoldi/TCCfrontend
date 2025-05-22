import React, { useEffect } from "react";
import { Modal, Form, Select, DatePicker, TimePicker, InputNumber, Input, message } from "antd";
import moment from "moment";
import { createAppointment, updateAppointment } from "../../services/appointment-service";

const { Option } = Select;

export default function AppointmentForm({
  visible,
  onCancel,
  onSaved,
  psychologists,
  patients,
  initialValues
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: moment(initialValues.date),
        time: moment(initialValues.time, "HH:mm:ss"),
        patient: initialValues.patient ? String(initialValues.patient.idUser) : null,
        psychologist: initialValues.psychologist ? String(initialValues.psychologist.idPsychologist) : null
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onOk = () => {
    form.validateFields().then(vals => {
      const pacienteSelecionado = patients.find(pt => String(pt.idUser) === String(vals.patient));
      const psicologoSelecionado = psychologists.find(ps => String(ps.idPsychologist) === String(vals.psychologist));

      const payload = {
        ...vals,
        patient: pacienteSelecionado ? { idPatient: pacienteSelecionado.idPatient } : null,
        psychologist: psicologoSelecionado ? { idPsychologist: psicologoSelecionado.idPsychologist } : null,
        date: vals.date.format("YYYY-MM-DD"),
        time: vals.time.format("HH:mm:ss")
      };

      const action = initialValues
        ? updateAppointment(initialValues.id, payload)
        : createAppointment(payload);

      action
        .then(() => {
          message.success("Agendamento salvo");
          onSaved();
        })
        .catch(err => message.error(err.response?.data || "Erro ao salvar"));
    });
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? "Editar Agendamento" : "Novo Agendamento"}
      onCancel={onCancel}
      onOk={onOk}
      okText="Salvar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Paciente"
          name="patient"
          rules={[{ required: true, message: "Selecione o paciente" }]}
        >
          <Select
            placeholder="Selecione"
            options={patients.map(pt => ({
              value: pt.idUser,
              label: pt.name
            }))}
          />
        </Form.Item>

        <Form.Item
          label="Psicólogo(a)"
          name="psychologist"
          rules={[{ required: true, message: "Selecione o psicólogo" }]}
        >
          <Select placeholder="Selecione">
            {psychologists.map(ps => (
              <Option key={ps.idPsychologist} value={ps.idPsychologist}>
                {ps.idUser.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Data"
          name="date"
          rules={[{ required: true, message: "Informe a data" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          label="Horário"
          name="time"
          rules={[{ required: true, message: "Informe o horário" }]}
        >
          <TimePicker style={{ width: "100%" }} format="HH:mm" />
        </Form.Item>

        <Form.Item
          label="Duração (min)"
          name="duration"
          rules={[{ required: true, message: "Informe a duração" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select>
            <Option value="SCHEDULED">Agendado</Option>
            <Option value="COMPLETED">Concluído</Option>
            <Option value="CANCELED">Cancelado</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Notas" name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
