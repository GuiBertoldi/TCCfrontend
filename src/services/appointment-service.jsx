import api from '../axiosConfig'

export const fetchAppointments = (params) =>
  api.get("/appointments", { params }).then(res => res.data);

export const fetchAppointmentById = (id) =>
  api.get(`/appointments/${id}`).then(res => res.data);

export const createAppointment = (payload) =>
  api.post("/appointments", payload).then(res => res.data);

export const updateAppointment = (id, payload) =>
  api.put(`/appointments/${id}`, payload).then(res => res.data);

export const deleteAppointment = (id) =>
  api.delete(`/appointments/${id}`).then(res => res.data);