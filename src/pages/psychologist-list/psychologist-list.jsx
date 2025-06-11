import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchPsychologists } from "../../services/psychologist-service";

export default function PsychologistList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
    (async () => {
        setLoading(true);
        try {
        const full = await fetchPsychologists();
        const list = full.content;
        setList(list);
        } catch {
        message.error("Erro ao carregar psicólogos");
        } finally {
        setLoading(false);
        }
    })();
    }, []);

  const columns = [
    { title: "Nome", dataIndex: ["idUser", "name"] },
    { title: "CRP", dataIndex: "crp" },
    {
      title: "Ações",
      render: (_, rec) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/psychologists/${rec.idPsychologist}/availabilities`)
          }
        >
          Ver Disponibilidades
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Selecione um Psicólogo</h2>
      <Table
        rowKey="idPsychologist"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
      />
    </div>
  );
}
