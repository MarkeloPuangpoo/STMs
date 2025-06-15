import { z } from 'zod'

export const studentSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  class: z.string().min(1, 'Class is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
})

export type StudentFormData = z.infer<typeof studentSchema> 