export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  full_name: string;
  role: string;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth: string;
  gender: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  blood_type?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: number;
  user_id: number;
  specialization: string;
  license_number: string;
  phone: string;
  bio?: string;
  office_hours?: string;
  email?: string;
  username?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  reason: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id?: number;
  diagnosis: string;
  treatment: string;
  notes?: string;
  prescriptions: Prescription[];
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: number;
  medical_record_id: number;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  created_at: string;
}

export interface Bill {
  id: number;
  patient_id: number;
  bill_number: string;
  amount: number;
  tax: number;
  total_amount: number;
  description?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  payments: Payment[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  bill_id: number;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  notes?: string;
  payment_date: string;
  created_at: string;
}
