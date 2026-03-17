import { apiRequest } from '../client';
import type { MedicalRecord, Patient } from '../../types/patient.types';

export const patientsApi = {
  getProfile: (token: string) =>
    apiRequest<Patient>('/patients/me', { token }),

  updateProfile: (token: string, data: Partial<Patient>) =>
    apiRequest<Patient>('/patients/me', { method: 'PATCH', body: data, token }),

  getMedicalRecords: (token: string) =>
    apiRequest<MedicalRecord[]>('/patients/me/records', { token }),
};
