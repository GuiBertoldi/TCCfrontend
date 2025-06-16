import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  DatePicker,
  Input,
  message,
  Space,
  Popconfirm
} from 'antd';
import moment from 'moment';
import {
  fetchTreatmentsByPatientId,
  createTreatment,
  updateTreatment,
  deleteTreatment
} from '../../services/treatment-service';

export default function TreatmentManager({ patientId }) {
  const [treatments, setTreatments]       = useState([]);
  const [loading, setLoading]             = useState(false);
  const [modalVisible, setModalVisible]   = useState(false);
  const [editing, setEditing]             = useState(null);
  const [form]                            = Form.useForm();

  useEffect(() => {
    if (!patientId) {
      setTreatments([]);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const list = await fetchTreatmentsByPatientId(patientId);
        setTreatments(Array.isArray(list) ? list : list.content || []);
      } catch {
        message.error('Não foi possível carregar tratamentos');
      } finally {
        setLoading(false);
      }
    })();
  }, [patientId]);

  const openModal = record => {
    setEditing(record || null);
    if (record) {
      form.setFieldsValue({
        medicine:       record.medicine,
        startTreatment: moment(record.startTreatment),
        endTreatment:   record.endTreatment ? moment(record.endTreatment) : null
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditing(null);
    form.resetFields();
  };

  const onFinish = async values => {
    if (!patientId) {
      message.error('Selecione um paciente antes de adicionar tratamento');
      return;
    }
    const payload = {
      patientId,
      medicine:       values.medicine,
      startTreatment: values.startTreatment.format('YYYY-MM-DD'),
      endTreatment:   values.endTreatment
        ? values.endTreatment.format('YYYY-MM-DD')
        : null
    };
    try {
      if (editing) {
        await updateTreatment(editing.idTreatment, payload);
        message.success('Tratamento atualizado');
      } else {
        await createTreatment(payload);
        message.success('Tratamento criado');
      }
      closeModal();
      const list = await fetchTreatmentsByPatientId(patientId);
      setTreatments(Array.isArray(list) ? list : list.content || []);
    } catch {
      message.error('Erro ao salvar tratamento');
    }
  };

  const onDelete = async id => {
    try {
      await deleteTreatment(id);
      message.success('Tratamento removido');
      setTreatments(ts => ts.filter(t => t.idTreatment !== id));
    } catch {
      message.error('Erro ao remover tratamento');
    }
  };

  const columns = [
    { title: 'Medicamento',   dataIndex: 'medicine' },
    { title: 'Início',        dataIndex: 'startTreatment' },
    { title: 'Fim',           dataIndex: 'endTreatment' },
    {
      title: 'Ações',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => openModal(rec)}>
            Editar
          </Button>
          <Popconfirm
            title="Remover este tratamento?"
            onConfirm={() => onDelete(rec.idTreatment)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger size="small">Excluir</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Button
        type="dashed"
        block
        style={{ marginBottom: 8 }}
        onClick={() => openModal()}
        disabled={!patientId}
      >
        + Novo Tratamento
      </Button>

      <Table
        size="small"
        rowKey="idTreatment"
        loading={loading}
        columns={columns}
        dataSource={treatments}
        pagination={false}
        locale={{ emptyText: 'Não há tratamentos' }}
      />

      <Modal
        title={editing ? 'Editar Tratamento' : 'Novo Tratamento'}
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="medicine"
            label="Medicamento"
            rules={[{ required: true, message: 'Informe o nome do medicamento' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="startTreatment"
            label="Data de Início"
            rules={[{ required: true, message: 'Informe a data de início' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endTreatment"
            label="Data de Fim (opcional)"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editing ? 'Salvar Alterações' : 'Criar Tratamento'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
