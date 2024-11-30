import React, { useEffect, useState } from "react";
import { fetchPatients } from "../../services/patient-service";
import { Table,Button } from "antd";
import { EditOutlined, UnorderedListOutlined} from '@ant-design/icons';
import { Navigate, useNavigate} from "react-router-dom";
import "./patient-list.css";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const defaultColumns = [
    {
      dataIndex: "name",
      key: "name",
      title: "Nome",
    },
    {
      dataIndex: "cpf",
      key: "cpf",
      title: "CPF",
      width: "300px"
    },
    {
      dataIndex: "edit",
      key: "edit",
      title: "",
      render: (_,patient) => {
        return <Button type="text" className="button-edit" onClick={() => handleClickEdit(patient)} icon={<EditOutlined />} />
      },
      width: "70px"
    },
    {
        dataIndex: "edit",
        key: "edit",
        title: "",
        render: (_,patient) => {
          return <Button type="text" className="button-edit" onClick={() => handleClickList(patient)} icon={<UnorderedListOutlined />} />
        },
        width: "70px"
      },
  ]

  useEffect(() => {
    const getPatients = async () => {
      try {
        const data = await fetchPatients();
        setPatients(data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    };

    getPatients();
  }, []);

  const handleClickEdit = (patient) => {
    
  navigate(`/patient-edit/${patient.idUser}`)
  }

  const handleClickList = (patient) => {
    
    navigate(`/sessions-list/${patient.idUser}`)
    }

  return (
    <div className="patient-list-page">
      <div className="patient-content">
      <h2>
        Pacientes
      </h2>
        <Table 
          rootClassName="patient-table"
        columns={defaultColumns}
        dataSource={patients}
          rowKey={"idUser"}
          scroll={{ y: "400px", x: "200px" }}
          pagination={
            { hideOnSinglePage: true, defaultPageSize: 6 }
          }
        />
        </div>
    </div>
  );
};

export default PatientList;
