import api from '../axiosConfig'

export async function fetchTreatmentsByPatientId(patientId) {
  const { data } = await api.get(`/treatments/patient/${patientId}`)
  return data
}

export async function createTreatment(payload) {
  const { data } = await api.post('/treatments', payload)
  return data
}

export async function updateTreatment(idTreatment, payload) {
  const { data } = await api.put(`/treatments/${idTreatment}`, payload)
  return data
}

export async function deleteTreatment(idTreatment) {
  await api.delete(`/treatments/${idTreatment}`)
}
