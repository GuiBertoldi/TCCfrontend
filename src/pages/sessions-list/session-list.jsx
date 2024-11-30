import React, { useEffect, useState } from "react";
import { fetchSessionsByUserId } from "../../services/sessions-service"; // Importando a função de serviço
import { Table, Button } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from "react-router-dom"; // Importando useParams para capturar o userId da URL
import "./session-list.css";

const SessionList = () => {
  const { idUser } = useParams(); // Captura o userId da URL
  const navigate = useNavigate();

  const [sessionsData, setSessionsData] = useState([]);
  const [error, setError] = useState("");

  const defaultColumns = [
    {
      dataIndex: "idSession", // ID da consulta
      key: "idSession",
      title: "Número da Consulta",
    },
    {
      dataIndex: "sessionDate", // Data da consulta
      key: "sessionDate",
      title: "Data da Consulta",
    },
    {
      dataIndex: "psychologist", // Psicólogo responsável
      key: "psychologist",
      title: "Psicólogo(a)",
    },
    {
      dataIndex: "edit",
      key: "edit",
      title: "",
      render: (_, session) => {
        return (
          <Button 
            type="text" 
            className="button-edit" 
            onClick={() => handleClickEdit(session)} 
            icon={<EditOutlined />} 
          />
        );
      },
      width: "70px",
    },
  ];

  useEffect(() => {
    if (!idUser) return;
    const fetchSessions = async () => {
      try {
        const response = await fetchSessionsByUserId(idUser); // Utilizando a função do serviço
        setSessionsData(response); // Atualiza o estado com as sessões
      } catch (error) {
        console.error("Erro ao carregar sessões:", error);
        setError("Erro ao carregar as sessões.");
      }
    };
    fetchSessions();
  }, [idUser]);

  const handleClickEdit = (session) => {
    console.log(session);
    navigate(`/session-edit/${session.idSession}`); // Redireciona para a edição da sessão
  };

  return (
    <div className="session-list-page">
      <div className="session-content">
        <h2>Lista de Sessões</h2>
        {error && <p className="error-message">{error}</p>} {/* Exibe mensagem de erro, se houver */}
        <Table
          rootClassName="session-table"
          columns={defaultColumns}
          dataSource={sessionsData} // Alterado para sessionsData
          rowKey="idSession"
          scroll={{ y: "400px", x: "200px" }}
          pagination={{ hideOnSinglePage: true, defaultPageSize: 6 }}
        />
      </div>
    </div>
  );
};

export default SessionList;
