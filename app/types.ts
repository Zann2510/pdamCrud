export interface User {
  id: number
  username: string
  password: string
  role: string
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: number
  user_id: number
  name: string
  phone: string
  owner_token: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface Services {
  id: number
  name: string
  min_usage: number
  max_usage: number
  price: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: number
  user_id: number
  customer_number: string
  name: string
  phone: string
  address: string
  service_id: number
  owner_token: string
  createdAt: string
  updatedAt: string
  user: User
  service: Services
}

export type Bill = {
    id: number
    customer_id: number
    admin_id: number
    month: number
    year: number
    measurement_number: string
    usage_value: number
    price: number
    service_id: number
    paid: boolean
    owner_token: string
    createdAt: string
    updatedAt: string
    customer?: {
        name: string
        customer_number: string
    }
}

export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface Payment {
  id: number
  bill_id: number
  customer_id: number
  amount: number
  payment_method: string
  proof_url?: string
  notes?: string
  status: PaymentStatus
  owner_token: string
  createdAt: string
  updatedAt: string
  bill?: Bill
  customer?: {
    name: string
    customer_number: string
  }
}