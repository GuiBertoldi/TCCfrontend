import axios from "axios";

export const api = axios.create({
  baseURL: "https://54.82.234.106:8080",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchSessionsByUserId = async () => {
  try {
    const response = await api.get(`/sessions/user`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sessões:", error);
    throw error;
  }
};
