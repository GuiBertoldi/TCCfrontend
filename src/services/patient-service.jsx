import axios from "axios";

export const api = axios.create({
  baseURL: "http://54.82.234.106:8080",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchPatients = async () => {
  try {
    const response = await api.get("/users/patients");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw error;
  }
};
