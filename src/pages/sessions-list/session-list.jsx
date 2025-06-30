import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Input, DatePicker, Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSessionsByUserId } from "../../services/sessions-service";
import moment from "moment";
import "./session-list.css";
import Sidebar from "../../components/sidebar/sidebar";

const { RangePicker } = DatePicker;

export default function SessionList() {
  const { idUser } = useParams();
  const navigate = useNavigate();

  const [sessionsData, setSessionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idUser) return;
    fetchSessionsByUserId(idUser)
      .then(data => {
        setSessionsData(data);
      })
      .catch(() => {
        setError("Erro ao carregar as sessões.");
      });
  }, [idUser]);

  const filteredSessions = useMemo(() => {
    const filtered = sessionsData
      .filter(session => {
        const [start, end] = dateRange;
        if (start && end) {
          const date = session.sessionDate;
          const from = start.format("YYYY-MM-DD");
          const to   = end.format("YYYY-MM-DD");
          return date >= from && date <= to;
        }
        return true;
      })
      .filter(session => {
        if (!searchTerm) return true;
        const name = session.idPsychologist?.idUser?.name?.toLowerCase() || "";
        return name.includes(searchTerm.toLowerCase());
      });

    return filtered.sort((a, b) => b.sessionNumber - a.sessionNumber);
  }, [sessionsData, searchTerm, dateRange]);

  const columns = [
    { title: "Nº da Consulta", dataIndex: "sessionNumber", key: "sessionNumber" },
    { title: "Paciente", dataIndex: ["idPatient", "idUser", "name"], key: "patientName" },
    {
      title: "Data da Consulta",
      dataIndex: "sessionDate",
      key: "sessionDate",
      render: d => d ? moment(d).format("DD/MM/YYYY") : ""
    },
    {
      title: "Psicólogo(a)",
      dataIndex: ["idPsychologist", "idUser", "name"],
      key: "psychologistName"
    },
    {
      title: "Editar",
      key: "edit",
      width: 70,
      render: (_, sess) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => navigate(`/session-edit/${sess.idSession}`)}
        />
      )
    }
  ];

  return (
    <div className="session-content">
      <Sidebar />
      <h2>Sessões do Paciente</h2>
      {error && <p className="error-message">{error}</p>}

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Buscar por Psicólogo"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
          />
        </Col>
        <Col>
          <RangePicker
            value={dateRange}
            onChange={dates => setDateRange(dates || [null, null])}
            format="DD/MM/YYYY"
            placeholder={["Data Início", "Data Fim"]}
            allowClear
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredSessions}
        rowKey="idSession"
        pagination={{ pageSize: 5, showSizeChanger: false }}
        style={{ width: "100%" }}
      />
    </div>
  );
}
