import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../../components/appointmentForm/appointment-form";
import { fetchPsychologists } from "../../services/psychologist-service";
import { fetchPatients } from "../../services/patient-service";
import { Spin, message } from "antd";

export default function AppointmentNew() {
  const navigate = useNavigate();
  const [psychologists, setPsychologists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPsychologists(), fetchPatients()])
      .then(([psyData, patData]) => {
        setPsychologists(psyData.content || psyData);
        setPatients(patData.content || patData);
      })
      .catch(() => message.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin style={{ margin: 32 }} />;

  return (
    <AppointmentForm
      visible={true}
      psychologists={psychologists}
      patients={patients}
      onCancel={() => navigate("/appointments")}
      onSaved={() => navigate("/appointments")}
    />
  );
}
