import api from "../axiosConfig";

export async function fetchSessionsByUserId(userId) {
  const { data } = await api.get(`/sessions/user/${userId}`);
  return data;
}

export async function fetchSessionById(idSession) {
  const { data } = await api.get(`/sessions/${idSession}`);
  return data;
}

export async function createSession(payload) {
  const { data } = await api.post("/sessions", payload);
  return data;
}

export async function updateSession(idSession, payload) {
  await api.put(`/sessions/${idSession}`, payload);
}
