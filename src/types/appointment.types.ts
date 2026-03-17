export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  type: 'in_person' | 'telehealth';
  reason?: string;
  notes?: string;
  meetingLink?: string;
}
