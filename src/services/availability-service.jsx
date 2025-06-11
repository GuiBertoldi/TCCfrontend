import api from '../axiosConfig';

export async function fetchAvailabilitiesByPsychologistId(psychologistId) {
  const { data } = await api.get(`/psychologists/${psychologistId}/availabilities`);
  return data;
}

export async function fetchAvailabilityById(psychologistId, availabilityId) {
  const { data } = await api.get(
    `/psychologists/${psychologistId}/availabilities/${availabilityId}`
  );
  return data;
}

export async function createAvailability(psychologistId, payload) {
  const { data } = await api.post(
    `/psychologists/${psychologistId}/availabilities`,
    payload
  );
  return data;
}

export async function updateAvailability(psychologistId, availabilityId, payload) {
  const { data } = await api.put(
    `/psychologists/${psychologistId}/availabilities/${availabilityId}`,
    payload
  );
  return data;
}

export async function deleteAvailability(psychologistId, availabilityId) {
  await api.delete(
    `/psychologists/${psychologistId}/availabilities/${availabilityId}`
  );
}