import api from '../axiosConfig'

export async function fetchPatientsByUserId() {
  const { data } = await api.get('/users/patients')
  return data
}

export async function fetchPatients() {
  const { data } = await api.get('/patients')
  return data
}

export async function fetchPatientById(id) {
  const { data } = await api.get(`/patients/search/${id}`)
  return data
}

export async function createPatient(patientData) {
  const { data } = await api.post('/patients', patientData)
  return data
}

export async function updatePatient(id, patientData) {
  const { data } = await api.put(`/patients/${id}`, patientData)
  return data
}

export async function deletePatient(id) {
  await api.delete(`/patients/${id}`)
}

export async function fetchUserById(id) {
  const { data } = await api.get(`/users/search/${id}`)
  return data
}
