import { supabase } from '@/lib/supabase/client'
import { Student, CreateStudentInput, UpdateStudentInput } from '@/types/student'

export const studentService = {
  // ดึงข้อมูลนักเรียนทั้งหมด
  async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ดึงข้อมูลนักเรียนตาม ID
  async getStudentById(id: string): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // เพิ่มนักเรียนใหม่
  async createStudent(input: CreateStudentInput): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert([input])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // อัพเดทข้อมูลนักเรียน
  async updateStudent(input: UpdateStudentInput): Promise<Student> {
    const { id, ...updateData } = input
    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ลบนักเรียน
  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // ค้นหานักเรียน
  async searchStudents(query: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .or(`student_id.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 