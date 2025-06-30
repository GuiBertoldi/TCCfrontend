import React, { useEffect, useState } from 'react';
import { Table, Form, Row, Col, Collapse, DatePicker, Input, Button, message, Space, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import {
  fetchTreatmentsByPatientId,
  createTreatment,
  updateTreatment,
  deleteTreatment
} from '../../services/treatment-service';

const { Panel } = Collapse;

export default function TreatmentManager({ patientId }) {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!patientId) return;
    loadList();
  }, [patientId]);

  const loadList = async () => {
    setLoading(true);
    try {
      const list = await fetchTreatmentsByPatientId(patientId);
      setTreatments(Array.isArray(list) ? list : list.content || []);
    } catch {
      message.error('Não foi possível carregar tratamentos');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = record => {
    setEditing(record);
    form.setFieldsValue({
      medicine: record.medicine,
      startTreatment: dayjs(record.startTreatment),
      endTreatment: record.endTreatment ? dayjs(record.endTreatment) : null
    });
    setActiveKey('form');
  };

  const onDelete = async id => {
    try {
      await deleteTreatment(id);
      message.success('Tratamento removido');
      loadList();
    } catch {
      message.error('Erro ao remover tratamento');
    }
  };

  const onFinish = async values => {
    if (!patientId) {
      message.error('Selecione um paciente antes de adicionar tratamento');
      return;
    }
    const payload = {
      patientId,
      medicine: values.medicine,
      startTreatment: values.startTreatment.format('YYYY-MM-DD'),
      endTreatment: values.endTreatment
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
      setEditing(null);
      form.resetFields();
      setActiveKey(null);
      loadList();
    } catch {
      message.error('Erro ao salvar tratamento');
    }
  };

  const columns = [
    { title: 'Medicamento', dataIndex: 'medicine' },
    { title: 'Início', dataIndex: 'startTreatment' },
    { title: 'Fim', dataIndex: 'endTreatment' },
    {
      title: 'Ações',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => onEdit(rec)}>Editar</Button>
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
    <div>
      <Collapse accordion activeKey={activeKey} onChange={setActiveKey}>
        <Panel header={editing ? 'Editar Tratamento' : '+ Novo Tratamento'} key="form">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="medicine"
              label="Medicamento"
              rules={[{ required: true, message: 'Informe o nome do medicamento' }]}
            >
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTreatment"
                  label="Data de Início"
                  rules={[{ required: true, message: 'Informe a data de início' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endTreatment"
                  label="Data de Fim (opcional)"
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => { setEditing(null); form.resetFields(); setActiveKey(null); }}>Limpar</Button>
                <Button type="primary" htmlType="submit">
                  {editing ? 'Salvar' : 'Criar'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>

      <Table
        size="small"
        rowKey="idTreatment"
        loading={loading}
        columns={columns}
        dataSource={treatments}
        pagination={false}
        locale={{ emptyText: 'Não há tratamentos' }}
      />
    </div>
  );
}
