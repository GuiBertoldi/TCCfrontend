import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Form, Collapse, Input, Button, message, Space, Popconfirm } from 'antd';
import {
  fetchFollowupsByPatientId,
  createFollowup,
  updateFollowup,
  deleteFollowup
} from '../../services/followup-service';

const { Panel } = Collapse;

export default function FollowupManager({ patientId }) {
  const [list, setList] = useState([]);
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
      const data = await fetchFollowupsByPatientId(patientId);
      setList(Array.isArray(data) ? data : []);
    } catch {
      message.error('Erro ao carregar acompanhamentos');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = record => {
    setEditing(record);
    form.setFieldsValue({
      professionalName: record.professionalName,
      professionalSpecialty: record.professionalSpecialty
    });
    setActiveKey('form');
  };

  const onDelete = async id => {
    try {
      await deleteFollowup(id);
      message.success('Acompanhamento removido');
      loadList();
    } catch {
      message.error('Erro ao remover acompanhamento');
    }
  };

  const onFinish = async values => {
    if (!patientId) {
      message.error('Selecione um paciente antes de adicionar acompanhamento');
      return;
    }
    const payload = {
      patientId,
      professionalName: values.professionalName,
      professionalSpecialty: values.professionalSpecialty
    };
    try {
      if (editing) {
        await updateFollowup(editing.idFollowUp, payload);
        message.success('Acompanhamento atualizado');
      } else {
        await createFollowup(payload);
        message.success('Acompanhamento criado');
      }
      setEditing(null);
      form.resetFields();
      setActiveKey(null);
      loadList();
    } catch {
      message.error('Erro ao salvar acompanhamento');
    }
  };

  const columns = [
    { title: 'Profissional', dataIndex: 'professionalName' },
    { title: 'Especialidade', dataIndex: 'professionalSpecialty' },
    {
      title: 'Ações',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => onEdit(rec)}>Editar</Button>
          <Popconfirm
            title="Remover este acompanhamento?"
            onConfirm={() => onDelete(rec.idFollowUp)}
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
        <Panel header={editing ? 'Editar Acompanhamento' : '+ Novo Acompanhamento'} key="form">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="professionalName"
              label="Profissional"
              rules={[{ required: true, message: 'Informe o nome do profissional' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="professionalSpecialty"
              label="Especialidade"
              rules={[{ required: true, message: 'Informe a especialidade' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => { setEditing(null); form.resetFields(); setActiveKey(null); }}>Cancelar</Button>
                <Button type="primary" htmlType="submit">
                  {editing ? 'Salvar' : 'Criar'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>

      <Table
        rowKey="idFollowUp"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
        locale={{ emptyText: 'Não há acompanhamentos' }}
      />
    </div>
  );
}

FollowupManager.propTypes = {
  patientId: PropTypes.number
};
