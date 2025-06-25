import React, { useEffect, useState } from "react";
import { fetchPatientsByUserId } from "../../services/patient-service";
import { Table, Input, Button } from "antd";
import { EditOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import "./patient-list.css";

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [term, setTerm] = useState("");

  useEffect(() => {
    fetchPatientsByUserId().then((data) => {
      setPatients(data);
      setFiltered(data);
    });
  }, []);

  const onChange = (e) => {
    const t = e.target.value.toLowerCase();
    setTerm(t);
    setFiltered(
      t
        ? patients.filter(
            (p) =>
              p.name.toLowerCase().includes(t) ||
              p.cpf.toLowerCase().includes(t)
          )
        : patients
    );
  };

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    { title: "CPF", dataIndex: "cpf", key: "cpf" },
    {
      key: "edit",
      width: 70,
      render: (_, p) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => navigate(`/patient-edit/${p.idUser}`)}
        />
      ),
    },
    {
      key: "list",
      width: 70,
      render: (_, p) => (
        <Button
          type="text"
          icon={<UnorderedListOutlined />}
          onClick={() => navigate(`/sessions-list/${p.idUser}`)}
        />
      ),
    },
  ];

  return (
    <div className="patient-list-page">
      <Sidebar/>
      <div className="patient-content">
        <h2>Pacientes</h2>
        <Input
          className="search-input"
          placeholder="Buscar por nome ou CPF"
          value={term}
          onChange={onChange}
          allowClear
        />
        <Table
          className="patients-table"
          columns={columns}
          dataSource={filtered}
          rowKey="idUser"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  );
}
