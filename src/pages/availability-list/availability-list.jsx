import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  message,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import {
  fetchAvailabilitiesByPsychologistId,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../../services/availability-service";

const { Option } = Select;
const diasSemana = [
  { label: "Segunda-feira", value: "MONDAY" },
  { label: "Terça-feira",  value: "TUESDAY" },
  { label: "Quarta-feira", value: "WEDNESDAY" },
  { label: "Quinta-feira", value: "THURSDAY" },
  { label: "Sexta-feira",  value: "FRIDAY" },
  { label: "Sábado",       value: "SATURDAY" },
  { label: "Domingo",      value: "SUNDAY" },
];

export default function AvailabilityList() {
  const { idPsychologist } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, record: null });
  const [form] = Form.useForm();

  useEffect(() => {
    if (!idPsychologist) return;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAvailabilitiesByPsychologistId(
          Number(idPsychologist)
        );
        setList(data);
      } catch {
        message.error("Erro ao carregar disponibilidades");
      } finally {
        setLoading(false);
      }
    })();
  }, [idPsychologist]);

  const openModal = (rec = null) => {
    setModal({ visible: true, record: rec });
    if (rec) {
      form.setFieldsValue({
        dayOfWeek: rec.dayOfWeek,
        startTime: dayjs(rec.startTime, "HH:mm:ss"),
        endTime:   dayjs(rec.endTime,   "HH:mm:ss"),
      });
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setModal({ visible: false, record: null });
    form.resetFields();
  };
  
  const onFinish = async (values) => {
    const payload = {
      dayOfWeek: values.dayOfWeek,
      startTime: values.startTime.format("HH:mm:ss"),
      endTime:   values.endTime.format("HH:mm:ss"),
    };
    try {
      if (modal.record) {
        await updateAvailability(
          Number(idPsychologist),
          modal.record.id,
          payload
        );
        message.success("Disponibilidade atualizada");
      } else {
        await createAvailability(Number(idPsychologist), payload);
        message.success("Disponibilidade criada");
      }
      closeModal();
      const data = await fetchAvailabilitiesByPsychologistId(
        Number(idPsychologist)
      );
      setList(data);
    } catch {
      message.error("Erro ao salvar");
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteAvailability(Number(idPsychologist), id);
      message.success("Removido");
      const data = await fetchAvailabilitiesByPsychologistId(
        Number(idPsychologist)
      );
      setList(data);
    } catch {
      message.error("Erro ao remover");
    }
  };

  const columns = [
    {
      title: "Dia",
      dataIndex: "dayOfWeek",
      render: d => diasSemana.find(x => x.value === d)?.label,
    },
    { title: "Início", dataIndex: "startTime" },
    { title: "Fim",    dataIndex: "endTime"   },
    {
      title: "Ações",
      render: (_, rec) => (
        <>
          <Button
            size="small"
            onClick={() => openModal(rec)}
            style={{ marginRight: 8 }}
          >
            Editar
          </Button>
          <Popconfirm
            title="Remover?"
            onConfirm={() => onDelete(rec.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger size="small">
              Remover
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 16 }}
      >
        Nova Disponibilidade
      </Button>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
      />

      <Modal
        title={modal.record ? "Editar Disponibilidade" : "Nova Disponibilidade"}
        visible={modal.visible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="dayOfWeek"
            label="Dia da Semana"
            rules={[{ required: true, message: "Selecione um dia!" }]}
          >
            <Select options={diasSemana} />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Hora Início"
            rules={[{ required: true, message: "Informe a hora!" }]}
          >
            <TimePicker format="HH:mm" minuteStep={15} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="Hora Fim"
            rules={[{ required: true, message: "Informe a hora!" }]}
          >
            <TimePicker format="HH:mm" minuteStep={15} style={{ width: "100%" }} />
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
