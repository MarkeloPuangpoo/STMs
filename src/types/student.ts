export interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  class: string
  phone?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface CreateStudentInput {
  student_id: string
  first_name: string
  last_name: string
  class: string
  phone?: string
  email?: string
}

export interface UpdateStudentInput {
  id: string
  student_id: string
  class: string
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
}