import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAppointmentById } from "../../services/appointment-service";
import AppointmentForm from "../../components/appointmentForm/appointment-form";
import { fetchPsychologists } from "../../services/psychologist-service"; 
import { fetchPatients } from "../../services/patient-service"; 

import { Spin, message } from "antd";

export default function AppointmentFormPage() {
  const { id } = useParams();           // :id da rota /appointments/edit/:id
  const navigate = useNavigate();
  const [initialValues, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [psychologists, setPsychologists] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // carregar listas para selects
    fetchPsychologists().then(setPsychologists).catch(() => message.error("Erro ao carregar psicólogos"));
    fetchPatients().then(setPatients).catch(() => message.error("Erro ao carregar pacientes"));

    if (id) {
      setLoading(true);
      fetchAppointmentById(id)
        .then(appt => {
          // form espera { id, patient: id, psychologist: id, date, time, duration, status, notes }
          setInitial({
            id: appt.id,
            patient: appt.patient.id,
            psychologist: appt.psychologist.id,
            date: appt.date,
            time: appt.time,
            duration: appt.duration,
            status: appt.status,
            notes: appt.notes,
          });
        })
        .catch(() => message.error("Erro ao carregar agendamento"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Spin style={{ margin: 32 }} />;

  return (
    <AppointmentForm
      visible={true}
      initialValues={initialValues}
      onCancel={() => navigate("/appointments")}
      onSaved={() => navigate("/appointments")}
      psychologists={psychologists}
      patients={patients}
    />
  );
}