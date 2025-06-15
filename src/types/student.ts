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

export interface UpdateStudentInput extends Partial<CreateStudentInput> {
  id: string
} 