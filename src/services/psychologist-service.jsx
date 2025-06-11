import api from '../axiosConfig'

export const fetchPsychologists = () =>
  api.get("/psychologists").then(res => res.data);
