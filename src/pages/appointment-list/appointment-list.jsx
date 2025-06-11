// src/pages/appointment-list/appointment-list.jsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Drawer,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Input,
  InputNumber,
  message,
  Space,
  Popconfirm
} from 'antd';
import dayjs from 'dayjs';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../../services/appointment-service';
import { fetchPsychologists } from '../../services/psychologist-service';
import { fetchPatients } from '../../services/patient-service';

const statusOptions = [
  { label: 'SCHEDULED', value: 'SCHEDULED' },
  { label: 'CONFIRMED', value: 'CONFIRMED' },
  { label: 'CANCELLED', value: 'CANCELLED' }
];

export default function AppointmentList() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState({ visible: false, record: null });
  const [form] = Form.useForm();
  const [psychOptions, setPsychOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const pysRes = await fetchPsychologists();
        const pysList = Array.isArray(pysRes) ? pysRes : pysRes.content || [];
        setPsychOptions(
          pysList.map(p => ({ value: p.idPsychologist, label: p.idUser.name }))
        );

        const patsRes = await fetchPatients();
        const patsList = Array.isArray(patsRes) ? patsRes : patsRes.content || [];
        setPatientOptions(
          patsList.map(p => ({ value: p.idUser, label: p.name }))
        );
      } catch {
        message.error('Erro ao carregar opções de psicólogos e pacientes');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await fetchAppointments(filters);
        setData(list);
      } catch {
        message.error('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  const openDrawer = record => {
    setDrawer({ visible: true, record });
    if (record) {
      form.setFieldsValue({
        idPatient: record.patient.idUser,
        idPsychologist: record.psychologist.idUser,
        date: dayjs(record.date),
        time: dayjs(record.time, 'HH:mm'),
        duration: record.duration,
        status: record.status,
        notes: record.notes
      });
    } else {
      form.resetFields();
    }
  };

  const closeDrawer = () => {
    setDrawer({ visible: false, record: null });
    form.resetFields();
  };

  const onFinish = async values => {
    const payload = {
      idPatient: values.idPatient,
      idPsychologist: values.idPsychologist,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm'),
      duration: values.duration,
      status: values.status,
      notes: values.notes
    };
    try {
      if (drawer.record) {
        await updateAppointment(drawer.record.idAppointment, payload);
        message.success('Agendamento atualizado');
      } else {
        await createAppointment(payload);
        message.success('Agendamento criado');
      }
      closeDrawer();
      setFilters(f => ({ ...f }));
    } catch {
      message.error('Erro ao salvar agendamento');
    }
  };

  const onDelete = async id => {
    try {
      await deleteAppointment(id);
      message.success('Agendamento removido');
      setFilters(f => ({ ...f }));
    } catch {
      message.error('Erro ao remover');
    }
  };

  const columns = [
    { title: 'Data', dataIndex: 'date', render: d => dayjs(d).format('YYYY-MM-DD') },
    { title: 'Horário', dataIndex: 'time' },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Paciente', render: (_, rec) => rec.patient.idUser.name },
    { title: 'Psicólogo', render: (_, rec) => rec.psychologist.idUser.name },
    {
      title: 'Ações',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => openDrawer(rec)}>Editar</Button>
          <Popconfirm title="Remover?" onConfirm={() => onDelete(rec.idAppointment)}>
            <Button danger size="small">Deletar</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Psicólogo"
          style={{ width: 200 }}
          options={psychOptions}
          onChange={value => setFilters(f => ({ ...f, idPsychologist: value }))}
        />
        <Select
          placeholder="Paciente"
          style={{ width: 200 }}
          options={patientOptions}
          onChange={value => setFilters(f => ({ ...f, idPatient: value }))}
        />
        <DatePicker
          placeholder="Data"
          onChange={d => setFilters(f => ({ ...f, date: d ? d.format('YYYY-MM-DD') : undefined }))}
        />
        <Select
          placeholder="Status"
          style={{ width: 160 }}
          options={statusOptions}
          onChange={value => setFilters(f => ({ ...f, status: value }))}
        />
        <Button type="primary" onClick={() => openDrawer()}>Novo</Button>
      </Space>

      <Table
        rowKey="idAppointment"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />

      <Drawer
        title={drawer.record ? 'Editar Agendamento' : 'Novo Agendamento'}
        open={drawer.visible}
        width={400}
        onClose={closeDrawer}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="idPatient" label="Paciente" rules={[{ required: true }]}> <Select options={patientOptions} /> </Form.Item>
          <Form.Item name="idPsychologist" label="Psicólogo" rules={[{ required: true }]}> <Select options={psychOptions} /> </Form.Item>
          <Form.Item name="date" label="Data" rules={[{ required: true }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="time" label="Horário" rules={[{ required: true }]}> <TimePicker format="HH:mm" minuteStep={15} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="duration" label="Duração (min)" rules={[{ required: true }]}> <InputNumber min={1} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}> <Select options={statusOptions} /> </Form.Item>
          <Form.Item name="notes" label="Observações"> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item> <Button type="primary" htmlType="submit" block>Salvar</Button> </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
