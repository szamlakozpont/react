export type User = {
  id: string;
  name: string;
  password: string;
  email: string;
  type: 'support' | 'supplier' | 'customer';
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string;
  has_tfa: 'no' | 'email' | 'sms';
  is_tfa_verified: boolean;
};

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  language: 'HU' | 'EN';
  custom_email: string;
  phone: string;
  supplier_id: string;
  supplier_name: string;
};
