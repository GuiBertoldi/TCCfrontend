import React, { useEffect, useState } from "react";
import { Calendar, Badge } from "antd";
import moment from "moment";
import { fetchAppointments } from "../services/appointment-service";
import AppointmentForm from "../components/Appointment-form";

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = () =>
    fetchAppointments({}).then(setAppointments);

  const dateCellRender = value => {
    const list = appointments.filter(app =>
      moment(app.date).isSame(value, "day")
    );
    return (
      <ul>
        {list.map(item => (
          <li key={item.id}>
            <Badge status="success" text={`${item.time.substr(0,5)} – ${item.patient.name}`} />
          </li>
        ))}
      </ul>
    );
  };

  const onSelect = value => {
    setSelectedDate(value);
    setModalVisible(true);
  };

  return (
    <>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={onSelect}
      />

      <AppointmentForm
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSaved={() => {
          setModalVisible(false);
          load();
        }}
        initialValues={
          selectedDate
            ? { date: selectedDate.format("YYYY-MM-DD") }
            : null
        }
        psychologists={[]} 
        patients={[]}       
      />
    </>
  );
}
