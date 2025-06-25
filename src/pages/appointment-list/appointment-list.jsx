// src/pages/appointment-list/appointment-list.jsx
import React, { useEffect, useState, useMemo } from 'react';
import './appointment-list.css';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Input,
  InputNumber,
  message,
  Space,
  Popconfirm,
  Card
} from 'antd';
import Sidebar from "../../components/sidebar/sidebar";
import moment from 'moment';
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../../services/appointment-service';
import { fetchPsychologists } from '../../services/psychologist-service';
import { fetchPatients } from '../../services/patient-service';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusOptions = [
  { label: 'Agendado',   value: 'SCHEDULED' },
  { label: 'Finalizado', value: 'COMPLETED' },
  { label: 'Cancelado',  value: 'CANCELLED' },
  { label: 'Confirmado', value: 'CONFIRMED' }
];

export default function AppointmentList() {
  const [filters, setFilters] = useState({
    idPsychologist: undefined,
    idPatient:      undefined,
    dateRange:     [],
    status:         undefined
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAppt, setEditingAppt]   = useState(null);
  const [form] = Form.useForm();
  const [psychOptions,   setPsychOptions]   = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const pysRes = await fetchPsychologists();
        const pysList = Array.isArray(pysRes) ? pysRes : pysRes.content || [];
        setPsychOptions(pysList.map(p => ({
          value: p.idPsychologist,
          label: p.idUser.name
        })));

        const patsRes = await fetchPatients();
        const patsList = Array.isArray(patsRes) ? patsRes : patsRes.content || [];
        setPatientOptions(patsList.map(p => ({
          value: p.idPatient,
          label: p.idUser.name
        })));
      } catch {
        message.error('Erro ao carregar opções');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await fetchAppointments({});
        setAppointments(Array.isArray(list) ? list : list.content || []);
      } catch {
        message.error('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(rec => {
        if (!filters.idPsychologist) return true;
        return rec.psychologist.idPsychologist === filters.idPsychologist;
      })
      .filter(rec => {
        if (!filters.idPatient) return true;
        return rec.patient.idPatient === filters.idPatient;
      })
      .filter(rec => {
        const [start, end] = filters.dateRange;
        if (!start || !end) return true;
        const d = moment(rec.date, 'YYYY-MM-DD');
        return d.isSameOrAfter(start, 'day') && d.isSameOrBefore(end, 'day');
      })
      .filter(rec => {
        if (!filters.status) return true;
        return rec.status === filters.status;
      });
  }, [appointments, filters]);

  const openModal = appt => {
    form.resetFields();
    if (appt) {
      form.setFieldsValue({
        idPatient:      { value: appt.patient.idPatient,     label: appt.patient.idUser.name },
        idPsychologist: { value: appt.psychologist.idPsychologist, label: appt.psychologist.idUser.name },
        date:    moment(appt.date, 'YYYY-MM-DD'),
        time:    moment(appt.time, 'HH:mm:ss'),
        duration: appt.duration,
        status:   appt.status,
        notes:    appt.notes
      });
    } else {
      form.setFieldsValue({ duration: 60 });
    }
    setEditingAppt(appt || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingAppt(null);
  };

  const onFinish = async values => {
    const payload = {
      idPatient:      values.idPatient.value,
      idPsychologist: values.idPsychologist.value,
      date:    values.date.format('YYYY-MM-DD'),
      time:    values.time.format('HH:mm:ss'),
      duration: values.duration,
      status:   values.status,
      notes:    values.notes
    };
    try {
      if (editingAppt) {
        await updateAppointment(editingAppt.idAppointment, payload);
        message.success('Agendamento atualizado');
      } else {
        await createAppointment(payload);
        message.success('Agendamento criado');
      }
      closeModal();
      setLoading(true);
      const list = await fetchAppointments({});
      setAppointments(Array.isArray(list) ? list : list.content || []);
      setLoading(false);
      setFilters({ idPsychologist: undefined, idPatient: undefined, dateRange: [], status: undefined });
    } catch {
      message.error('Erro ao salvar');
    }
  };

  const onDelete = async id => {
    try {
      await deleteAppointment(id);
      message.success('Agendamento removido');
      setAppointments(appointments.filter(a => a.idAppointment !== id));
    } catch {
      message.error('Erro ao remover');
    }
  };

  const handleStatusChange = async (idAppointment, newStatus, rec) => {
    const payload = {
      idPatient:      rec.patient.idPatient,
      idPsychologist: rec.psychologist.idPsychologist,
      date:    rec.date,
      time:    rec.time,
      duration: rec.duration,
      status:   newStatus,
      notes:    rec.notes || ""
    };
    try {
      await updateAppointment(idAppointment, payload);
      message.success('Status atualizado');
      setAppointments(appointments.map(a =>
        a.idAppointment === idAppointment ? { ...a, status: newStatus } : a
      ));
    } catch {
      message.error('Erro ao atualizar status');
    }
  };

  const columns = [
    { title: 'Paciente',  render: (_, rec) => rec.patient.idUser.name },
    { title: 'Psicólogo', render: (_, rec) => rec.psychologist.idUser.name },
    { title: 'Data',      dataIndex: 'date',   render: d => moment(d).format('YYYY-MM-DD') },
    { title: 'Horário',   dataIndex: 'time' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, rec) => (
        <Select
          value={status}
          className="status-select"
          onChange={v => handleStatusChange(rec.idAppointment, v, rec)}
          options={statusOptions}
        />
      )
    },
    {
      title: 'Ações',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => openModal(rec)}>Editar</Button>
          <Popconfirm title="Remover?" onConfirm={() => onDelete(rec.idAppointment)}>
            <Button danger size="small">Deletar</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="appointment-list-container">
      <Sidebar/>
      <Card className="filter-card">
        <Space wrap size="middle">
          <Select
            showSearch
            placeholder="Pesquisar psicólogo"
            className="filter-select"
            options={psychOptions}
            value={filters.idPsychologist}
            onChange={v => setFilters(f => ({ ...f, idPsychologist: v }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
          <Select
            showSearch
            placeholder="Pesquisar paciente"
            className="filter-select"
            options={patientOptions}
            value={filters.idPatient}
            onChange={v => setFilters(f => ({ ...f, idPatient: v }))}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          />
          <RangePicker
            className="filter-range"
            placeholder={['Data início', 'Data fim']}
            value={
              filters.dateRange.length === 2
                ? [moment(filters.dateRange[0]), moment(filters.dateRange[1])]
                : []
            }
            onChange={dates => {
              if (dates && dates.length === 2) {
                setFilters(f => ({
                  ...f,
                  dateRange: [
                    dates[0].format('YYYY-MM-DD'),
                    dates[1].format('YYYY-MM-DD')
                  ]
                }));
              } else {
                setFilters(f => ({ ...f, dateRange: [] }));
              }
            }}
            allowClear
          />
          <Select
            placeholder="Status"
            className="filter-select"
            options={statusOptions}
            value={filters.status}
            onChange={v => setFilters(f => ({ ...f, status: v }))}
            allowClear
          />
          <Button type="primary" onClick={() => openModal(null)}>Novo</Button>
        </Space>
      </Card>

      <Table
        className="appointment-table"
        rowKey="idAppointment"
        loading={loading}
        columns={columns}
        dataSource={filteredAppointments}
        pagination={false}
      />

      <Modal
        title={editingAppt ? 'Editar Agendamento' : 'Novo Agendamento'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form className="appointment-form" form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="idPatient" label="Paciente" rules={[{ required: true }]}>
            <Select
              labelInValue
              showSearch
              placeholder="Pesquisar paciente"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!!editingAppt}
            >
              {patientOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="idPsychologist" label="Psicólogo" rules={[{ required: true }]}>
            <Select
              labelInValue
              showSearch
              placeholder="Pesquisar psicólogo"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!!editingAppt}
            >
              {psychOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Data" rules={[{ required: true }]}>
            <DatePicker className="form-date" />
          </Form.Item>

          <Form.Item name="time" label="Horário" rules={[{ required: true }]}>
            <TimePicker className="form-time" format="HH:mm" minuteStep={15} />
          </Form.Item>

          <Form.Item name="duration" label="Duração (min)" rules={[{ required: true }]}>
            <InputNumber className="form-duration" min={1} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={editingAppt
                ? statusOptions
                : statusOptions.filter(opt => opt.value !== 'CANCELLED')}
            />
          </Form.Item>

          <Form.Item name="notes" label="Observações">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>Salvar</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
