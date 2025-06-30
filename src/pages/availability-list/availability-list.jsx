import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  message,
  Popconfirm
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import {
  fetchAvailabilitiesByPsychologistId,
  createAvailability,
  updateAvailability,
  deleteAvailability
} from '../../services/availability-service';
import Sidebar from '../../components/sidebar/sidebar';

const diasSemana = [
  { label: 'Segunda-feira', value: 'MONDAY' },
  { label: 'Terça-feira',   value: 'TUESDAY' },
  { label: 'Quarta-feira',  value: 'WEDNESDAY' },
  { label: 'Quinta-feira',  value: 'THURSDAY' },
  { label: 'Sexta-feira',   value: 'FRIDAY' },
  { label: 'Sábado',        value: 'SATURDAY' },
  { label: 'Domingo',       value: 'SUNDAY' }
];

export default function AvailabilityList() {
  const { idPsychologist } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, record: null });
  const [editing, setEditing] = useState({ id: null, start: null, end: null });
  const [form] = Form.useForm();

  useEffect(() => {
    if (!idPsychologist) return;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAvailabilitiesByPsychologistId(+idPsychologist);
        setList(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [idPsychologist]);

  const refreshList = useCallback(async () => {
    const data = await fetchAvailabilitiesByPsychologistId(+idPsychologist);
    setList(data || []);
  }, [idPsychologist]);

  const openModal = useCallback(rec => {
    setModal({ visible: true, record: rec });
    if (rec) {
      form.setFieldsValue({
        dayOfWeek: rec.dayOfWeek,
        startTime: dayjs(rec.startTime, 'HH:mm:ss'),
        endTime:   dayjs(rec.endTime,   'HH:mm:ss')
      });
    } else {
      form.resetFields();
    }
  }, [form]);

  const closeModal = useCallback(() => {
    setModal({ visible: false, record: null });
    form.resetFields();
  }, [form]);

  const onFinish = useCallback(async values => {
    const payload = {
      dayOfWeek: values.dayOfWeek,
      startTime: values.startTime.format('HH:mm:ss'),
      endTime:   values.endTime.format('HH:mm:ss')
    };
    try {
      if (modal.record) {
        await updateAvailability(+idPsychologist, modal.record.id, payload);
        message.success('Disponibilidade atualizada');
      } else {
        await createAvailability(+idPsychologist, payload);
        message.success('Disponibilidade criada');
      }
      closeModal();
      await refreshList();
    } catch {
      message.error('Erro ao salvar');
    }
  }, [idPsychologist, modal.record, closeModal, refreshList]);

  const onDelete = useCallback(async rec => {
    try {
      await deleteAvailability(+idPsychologist, rec.id);
      message.success('Disponibilidade removida');
      await refreshList();
    } catch {
      message.error('Erro ao remover');
    }
  }, [idPsychologist, refreshList]);

  const saveInline = useCallback(async () => {
    const { id, start, end } = editing;
    try {
      const rec = list.find(r => r.id === id);
      if (!rec) throw new Error();
      await updateAvailability(+idPsychologist, id, {
        dayOfWeek: rec.dayOfWeek,
        startTime: start.format('HH:mm:ss'),
        endTime:   end.format('HH:mm:ss')
      });
      message.success('Horário atualizado');
      setEditing({ id: null, start: null, end: null });
      await refreshList();
    } catch {
      message.error('Erro ao atualizar');
    }
  }, [editing, list, idPsychologist, refreshList]);

  const cancelInline = useCallback(() => {
    setEditing({ id: null, start: null, end: null });
  }, []);

  const grouped = diasSemana.reduce((acc, d) => {
    acc[d.value] = list.filter(r => r.dayOfWeek === d.value);
    return acc;
  }, {});

  const maxRows = Math.max(...Object.values(grouped).map(arr => arr.length));
  const dataSource = Array.from({ length: maxRows }, (_, i) => {
    const row = { key: i };
    diasSemana.forEach(d => {
      row[d.value] = grouped[d.value][i] || null;
    });
    return row;
  });

  const onCellFactory = d => record => ({
    onDoubleClick: () => {
      const cell = record[d.value];
      if (cell) {
        setEditing({
          id:    cell.id,
          start: dayjs(cell.startTime, 'HH:mm:ss'),
          end:   dayjs(cell.endTime,   'HH:mm:ss')
        });
      }
    }
  });

  const renderCell = cell => {
    if (!cell) return '';
    if (editing.id === cell.id) {
      return (
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            <TimePicker
              value={editing.start}
              format="HH:mm"
              minuteStep={15}
              onChange={v => setEditing(e => ({ ...e, start: v }))}
            />
            <TimePicker
              value={editing.end}
              format="HH:mm"
              minuteStep={15}
              onChange={v => setEditing(e => ({ ...e, end: v }))}
            />
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <Button icon={<CheckOutlined />} size="small" onClick={saveInline} />
            <Button icon={<CloseOutlined />} size="small" onClick={cancelInline} />
            <Popconfirm
              title="Remover?"
              onConfirm={() => onDelete(cell)}
              okText="Sim"
              cancelText="Não"
            >
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Popconfirm>
          </div>
        </div>
      );
    }
    return `${dayjs(cell.startTime, 'HH:mm:ss').format('HH:mm')} - ${dayjs(cell.endTime, 'HH:mm:ss').format('HH:mm')}`;
  };

  const columns = diasSemana.map(d => ({
    title: d.label,
    dataIndex: d.value,
    key: d.value,
    onCell: onCellFactory(d),
    render: renderCell
  }));

  return (
    <div className="patient-content">
      <Sidebar />
      <h2>Disponibilidades</h2>
      <Button
        type="primary"
        onClick={() => openModal(null)}
        style={{ marginBottom: 16 }}
      >
        Nova Disponibilidade
      </Button>
      <Table
        className="patients-table"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: true }}
      />
      <Modal
        title={modal.record ? 'Editar Disponibilidade' : 'Nova Disponibilidade'}
        visible={modal.visible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="dayOfWeek"
            label="Dia da Semana"
            rules={[{ required: true }]}
          >
            <Select options={diasSemana} />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Hora Início"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" minuteStep={15} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="Hora Fim"
            rules={[{ required: true }]}
          >
            <TimePicker format="HH:mm" minuteStep={15} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
