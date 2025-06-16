import api from '../axiosConfig'

export async function fetchFollowupsByPatientId(patientId) {
  const { data } = await api.get(`/followups/patient/${patientId}`)
  return data
}

export async function createFollowup(payload) {
  const { data } = await api.post('/followups', payload)
  return data
}

export async function updateFollowup(idFollowup, payload) {
  const { data } = await api.put(`/followups/${idFollowup}`, payload)
  return data
}

export async function deleteFollowup(idFollowup) {
  await api.delete(`/followups/${idFollowup}`)
}
