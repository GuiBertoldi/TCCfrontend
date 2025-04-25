import api from "../axiosConfig"

export async function fetchSessionsByUserId(userId) {
  const { data } = await api.get(`/sessions/user/${userId}`)
  return data
}

export async function createSession(payload) {
  const { data } = await api.post("/sessions", payload)
  return data
}
