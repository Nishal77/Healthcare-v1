import { apiRequest } from '../client';
import type { Appointment } from '../../types/appointment.types';

export const appointmentsApi = {
  list: (token: string) =>
    apiRequest<Appointment[]>('/appointments', { token }),

  book: (token: string, data: Omit<Appointment, 'id' | 'status'>) =>
    apiRequest<Appointment>('/appointments', { method: 'POST', body: data, token }),

  cancel: (token: string, id: string) =>
    apiRequest<Appointment>(`/appointments/${id}/cancel`, { method: 'PATCH', token }),
};
