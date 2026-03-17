export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bloodType?: string;
  allergies: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  providerId: string;
  type: 'diagnosis' | 'medication' | 'lab_result' | 'imaging' | 'procedure' | 'note';
  title: string;
  description: string;
  date: string;
  attachments?: string[];
}
