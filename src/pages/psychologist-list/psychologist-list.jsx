import React, { useEffect, useState } from "react";
import { fetchPsychologists } from "../../services/psychologist-service";
import { Table, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import "./psychologist-list";

export default function PsychologistList() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const full = await fetchPsychologists();
        const data = Array.isArray(full) ? full : full.content || [];
        setList(data);
        setFiltered(data);
      } catch {
        message.error("Erro ao carregar psicólogos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = e => {
    const t = e.target.value.toLowerCase();
    setTerm(t);
    setFiltered(
      t
        ? list.filter(
            p =>
              p.idUser.name.toLowerCase().includes(t) ||
              p.crp.toLowerCase().includes(t)
          )
        : list
    );
  };

  const columns = [
    { title: "Nome", dataIndex: ["idUser", "name"], key: "name", width: 300 },
    { title: "CRP", dataIndex: "crp", key: "crp", width: 300 },
    {
      title: "Ações",
      key: "actions",
      render: (_, rec) => (
        <Button
          type="text"
          onClick={() =>
            navigate(`/psychologists/${rec.idPsychologist}/availabilities`)
          }
        >
          Ver Horários
        </Button>
      ),
      width: 200
    }
  ];

  return (
    <div className="patient-content">
      <Sidebar />
      <h2>Selecione um Psicólogo</h2>
      <Input
        className="search-input-patient"
        placeholder="Buscar por nome ou CRP"
        value={term}
        onChange={onChange}
        allowClear
      />
      <Table
        className="patients-table"
        rowKey="idPsychologist"
        loading={loading}
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 5, showSizeChanger: false }}
      />
    </div>
  );
}
