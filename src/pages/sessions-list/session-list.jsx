import React, { useEffect, useState } from "react";
import { Table, Button, Input, DatePicker, Row, Col } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSessionsByUserId } from "../../services/sessions-service";
import moment from "moment";
import "./session-list.css";

const { RangePicker } = DatePicker;

export default function SessionList() {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [sessionsData, setSessionsData] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    if (!idUser) return;
    fetchSessionsByUserId(idUser)
      .then(data => {
        setSessionsData(data);
        setFilteredSessions(data);
      })
      .catch(() => setError("Erro ao carregar as sessões."));
  }, [idUser]);

  const applyFilters = (term, range) => {
    let filtered = [...sessionsData];

    if (range && range.length === 2 && range[0] && range[1]) {
      const [start, end] = range;
      filtered = filtered.filter(session => {
        const sessionDate = moment(session.sessionDate, "YYYY-MM-DD");
        return sessionDate.isSameOrAfter(start, "day") && sessionDate.isSameOrBefore(end, "day");
      });
    }

    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(session => {
        const psychologistName = session.idPsychologist?.idUser?.name?.toLowerCase() || "";
        return psychologistName.includes(lowerTerm);
      });
    }

    setFilteredSessions(filtered);
  };

  const onSearchChange = e => {
    const val = e.target.value;
    setSearchTerm(val);
    applyFilters(val, dateRange);
  };

  const onDateRangeChange = dates => {
    setDateRange(dates);
    applyFilters(searchTerm, dates);
  };

  const columns = [
    { title: "Número da Consulta", dataIndex: "sessionNumber", key: "sessionNumber" },
    { title: "Paciente", dataIndex: ["idPatient", "idUser", "name"], key: "PatientName" },
    {
      title: "Data da Consulta",
      dataIndex: "sessionDate",
      key: "sessionDate",
      render: (date) => date ? moment(date, "YYYY-MM-DD").format("DD/MM/YYYY") : ""
    },
    { title: "Psicólogo(a)", dataIndex: ["idPsychologist", "idUser", "name"], key: "psychologistName" },
    {
      key: "edit",
      render: (_, session) => (
        <Button
          type="text"
          className="button-edit"
          onClick={() => navigate(`/session-edit/${session.idSession}`)}
          icon={<EditOutlined />}
        />
      ),
      width: 70,
    },
  ];

  return (
    <div className="session-list-page">
      <div className="session-content">
        <h2>Sessões do Paciente</h2>
        {error && <p className="error-message">{error}</p>}

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Buscar por Psicólogo"
              value={searchTerm}
              onChange={onSearchChange}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={10} lg={8}>
            <RangePicker
              onChange={onDateRangeChange}
              allowClear
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Data Início", "Data Fim"]}
            />
          </Col>
        </Row>

        <Table
          rootClassName="session-table"
          columns={columns}
          dataSource={filteredSessions}
          rowKey="idSession"
          pagination={{ hideOnSinglePage: true, defaultPageSize: 6 }}
          style={{ width: "100%" }}
          scroll={{ y: 450 }}
        />
      </div>
    </div>
  );
}
