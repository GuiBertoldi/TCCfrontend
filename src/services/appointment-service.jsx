import api from '../axiosConfig';

export async function fetchAppointments(filters) {
  const { data } = await api.get('/appointments', { params: filters });
  return data.content;
}

export async function fetchAppointmentById(idAppointment) {
  const { data } = await api.get(`/appointments/${idAppointment}`);
  return data;
}

export async function createAppointment(payload) {
  const { data } = await api.post('/appointments', payload);
  return data;
}

export async function updateAppointment(idAppointment, payload) {
  const { data } = await api.put(`/appointments/${idAppointment}`, payload);
  return data;
}

export async function deleteAppointment(idAppointment) {
  await api.delete(`/appointments/${idAppointment}`);
}
