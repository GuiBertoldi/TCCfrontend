import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSessionsByUserId } from "../../services/sessions-service";
import "./session-list.css";

export default function SessionList() {
  const { idUser } = useParams();
  const navigate = useNavigate();
  const [sessionsData, setSessionsData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idUser) return;
    fetchSessionsByUserId(idUser)
      .then(data => {
        setSessionsData(data);
      })
      .catch(err => {
        console.error("Erro ao carregar sessões:", err);
        setError("Erro ao carregar as sessões.");
      });
  }, [idUser]);

  const handleClickEdit = session => {
    navigate(`/session-edit/${session.idSession}`);
  };

  const columns = [
    {
      title: "Número da Consulta",
      dataIndex: "idSession",
      key: "idSession",
    },
    {
      title: "Data da Consulta",
      dataIndex: "sessionDate",
      key: "sessionDate",
    },
    {
      title: "Psicólogo(a)",
      dataIndex: "psychologist",
      key: "psychologist",
    },
    {
      key: "edit",
      render: (_, session) => (
        <Button
          type="text"
          className="button-edit"
          onClick={() => handleClickEdit(session)}
          icon={<EditOutlined />}
        />
      ),
      width: 70,
    },
  ];

  return (
    <div className="session-list-page">
      <div className="session-content">
        <h2>Lista de Sessões</h2>
        {error && <p className="error-message">{error}</p>}
        <Table
          rootClassName="session-table"
          columns={columns}
          dataSource={sessionsData}
          rowKey="idSession"
          scroll={{ y: 400, x: 200 }}
          pagination={{ hideOnSinglePage: true, defaultPageSize: 6 }}
        />
      </div>
    </div>
  );
}
