// src/components/FollowupManager/FollowupManager.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import {
  fetchFollowupsByPatientId,
  createFollowup,
  updateFollowup,
  deleteFollowup
} from '../../services/followup-service';

export default function FollowupManager({ patientId }) {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]     = useState({ open: false, record: null });
  const [form]                = Form.useForm();

  useEffect(() => {
    if (!patientId) return;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchFollowupsByPatientId(patientId);
        setList(Array.isArray(data) ? data : []);
      } catch {
        message.error('Erro ao carregar acompanhamentos');
      } finally {
        setLoading(false);
      }
    })();
  }, [patientId]);

  const open = rec => {
    setModal({ open: true, record: rec });
    if (rec) {
      form.setFieldsValue({
        professionalName:      rec.professionalName,
        professionalSpecialty: rec.professionalSpecialty
      });
    } else {
      form.resetFields();
    }
  };
  const close = () => {
    setModal({ open: false, record: null });
    form.resetFields();
  };

  const onFinish = async values => {
    const payload = {
      patientId,
      professionalName:      values.professionalName,
      professionalSpecialty: values.professionalSpecialty
    };
    try {
      if (modal.record) {
        await updateFollowup(modal.record.idFollowUp, payload);
        message.success('Acompanhamento atualizado');
      } else {
        await createFollowup(payload);
        message.success('Acompanhamento criado');
      }
      close();
      const data = await fetchFollowupsByPatientId(patientId);
      setList(Array.isArray(data) ? data : []);
    } catch {
      message.error('Erro ao salvar acompanhamento');
    }
  };

  const onDelete = async id => {
    try {
      await deleteFollowup(id);
      message.success('Acompanhamento removido');
      setList(list.filter(i => i.idFollowUp !== id));
    } catch {
      message.error('Erro ao remover acompanhamento');
    }
  };

  const columns = [
    { title: 'Profissional',  dataIndex: 'professionalName' },
    { title: 'Especialidade', dataIndex: 'professionalSpecialty' },
    {
      title: 'Ações',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => open(rec)}>Editar</Button>
          <Popconfirm title="Remover?" onConfirm={() => onDelete(rec.idFollowUp)}>
            <Button danger size="small">Deletar</Button>
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
        onClick={() => open(null)}
        style={{ marginBottom: 8 }}
        disabled={!patientId}
      >
        + Novo Acompanhamento
      </Button>

      <Table
        rowKey="idFollowUp"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
      />

      <Modal
        title={modal.record ? 'Editar Acompanhamento' : 'Novo Acompanhamento'}
        open={modal.open}
        onCancel={close}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="professionalName"
            label="Nome do Profissional"
            rules={[{ required: true, message: 'Informe o nome!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="professionalSpecialty"
            label="Especialidade"
            rules={[{ required: true, message: 'Informe a especialidade!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Salvar</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
