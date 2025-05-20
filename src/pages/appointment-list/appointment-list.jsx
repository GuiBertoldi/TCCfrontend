import React, { useEffect, useState } from "react";
import { Table, Button, Select, DatePicker, Row, Col, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { fetchAppointments, deleteAppointment } from "../../services/appointment-service";
import "./appointment-list.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AppointmentList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [psychologists, setPsychologists] = useState([]); // você deve popular essa lista de algum serviço
  const [filters, setFilters] = useState({ psychologistId: null, dateRange: null });
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    fetchAppointments({
      psychologistId: filters.psychologistId,
      from: filters.dateRange?.[0],
      to:   filters.dateRange?.[1]
    })
      .then(setData)
      .catch(() => message.error("Erro ao carregar agendamentos"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const onDelete = id => {
    deleteAppointment(id)
      .then(() => {
        message.success("Agendamento removido");
        load();
      })
      .catch(() => message.error("Não foi possível remover"));
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: d => moment(d).format("DD/MM/YYYY")
    },
    {
      title: "Horário",
      dataIndex: "time",
      key: "time",
      render: t => moment(t, "HH:mm:ss").format("HH:mm")
    },
    {
      title: "Paciente",
      dataIndex: ["patient", "name"],
      key: "patient"
    },
    {
      title: "Psicólogo(a)",
      dataIndex: ["psychologist", "name"],
      key: "psychologist"
    },
    {
      title: "Duração (min)",
      dataIndex: "duration",
      key: "duration",
      width: 120
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130
    },
    {
      title: "Ações",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            type="text"
            onClick={() => navigate(`/appointment-edit/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={() => onDelete(record.id)}
          />
        </>
      )
    }
  ];

  return (
    <div className="appointment-list-page">
      <div className="appointment-content">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/appointment-new")}
            >
              Novo Agendamento
            </Button>
          </Col>
          <Col>
            <Row gutter={8}>
              <Col>
                <Select
                  placeholder="Psicólogo"
                  allowClear
                  style={{ width: 200 }}
                  value={filters.psychologistId}
                  onChange={val => setFilters(f => ({ ...f, psychologistId: val }))}
                >
                  {psychologists.map(p => (
                    <Option key={p.id} value={p.id}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <RangePicker
                  format="DD/MM/YYYY"
                  onChange={dates =>
                    setFilters(f => ({
                      ...f,
                      dateRange:
                        dates && dates.length === 2
                          ? [dates[0].startOf("day"), dates[1].endOf("day")]
                          : null
                    }))
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ y: 400 }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
