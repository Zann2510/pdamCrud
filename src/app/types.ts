export interface Adminprofile {
  success: boolean;
  message: string;
  data: Admin;
}

export interface Admin {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id?: string | number;
  username: string;
  name: string;
  phone: string;
  telephone: string;
  address: string;
  service_id: string | number;
  created_at?: string; 
}