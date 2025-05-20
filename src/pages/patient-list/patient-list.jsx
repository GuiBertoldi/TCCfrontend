import React, { useEffect, useState } from "react";
import { fetchPatients } from "../../services/patient-service";
import { Table, Input, Button } from "antd";
import { EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import "./patient-list.css";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [term, setTerm]           = useState("");
  const [page, setPage]           = useState(1);

  useEffect(() => {
    fetchPatients().then(data => {
      setPatients(data);
      setFiltered(data);
    });
  }, []);

  const onChange = e => {
    const t = e.target.value.toLowerCase();
    setTerm(t);
    setPage(1);
    setFiltered(
      t
        ? patients.filter(p =>
            p.name.toLowerCase().includes(t) ||
            p.cpf.toLowerCase().includes(t)
          )
        : patients
    );
  };

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    { title: "CPF",  dataIndex: "cpf",  key: "cpf", width: 300 },
    {
      key: "edit",
      render: (_, p) =>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => navigate(`/patient-edit/${p.idUser}`)}
        />,
      width: 70
    },
    {
      key: "list",
      render: (_, p) =>
        <Button
          type="text"
          icon={<UnorderedListOutlined />}
          onClick={() => navigate(`/sessions-list/${p.idUser}`)}
        />,
      width: 70
    }
  ];

  return (
    <div className="patient-list-page">
      <div className="patient-content">
        <h2>Pacientes</h2>
        <Input
          placeholder="Buscar por nome ou CPF"
          value={term}
          onChange={onChange}
          allowClear
          style={{ width: 300, margin: "16px 0" }}
        />
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="idUser"
          pagination={{
            current: page,
            pageSize: 10,
            onChange: p => setPage(p),
            hideOnSinglePage: filtered.length <= 10
          }}
        />
      </div>
    </div>
  );
};

export default PatientList;
