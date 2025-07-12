import { supabase } from '@/lib/supabase/client'
import { Student, CreateStudentInput, UpdateStudentInput } from '@/types/student'

export const studentService = {
  // --- REFACTORED to a single function for getting students ---
  async getStudents(filters: { searchQuery?: string; selectedClass?: string } = {}): Promise<Student[]> {
    let query = supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
      .order('student_id', { ascending: true });

    // Apply class filter if it exists and is not 'all'
    if (filters.selectedClass && filters.selectedClass !== 'all') {
      query = query.eq('class', filters.selectedClass);
    }

    // Apply search query filter
    if (filters.searchQuery) {
      const q = filters.searchQuery;
      query = query.or(`student_id.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%`);
    }

    // ดึงข้อมูลแบบแบ่งหน้า (pagination)
    let allData: Student[] = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await query.range(from, from + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allData = allData.concat(data);
      if (data.length < pageSize) break; // หมดแล้ว
      from += pageSize;
    }
    return allData;
  },
  
  // --- UPDATED: No need for a database function ---
  // Function to get all unique class names directly from the table
  async getAvailableClasses(): Promise<string[]> {
    const { data, error } = await supabase
      .from('students')
      .select('class'); // Select only the 'class' column

    if (error) {
      console.error("Error fetching distinct classes:", error);
      throw error;
    }
    
    if (!data) return [];

    // Process data on the client-side to get unique, sorted class names
    const uniqueClasses = Array.from(new Set(data.map((item: { class: string }) => item.class)));
    return uniqueClasses.sort();
  },

  // ดึงข้อมูลนักเรียนตาม ID
  async getStudentById(id: string): Promise<Student> {
    const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  // เพิ่มนักเรียนใหม่
  async createStudent(input: CreateStudentInput): Promise<Student> {
    const { data, error } = await supabase.from('students').insert([input]).select().single();
    if (error) throw error;
    return data;
  },

  // อัพเดทข้อมูลนักเรียน
  async updateStudent(input: UpdateStudentInput): Promise<Student> {
    const { id, ...updateData } = input;
    const { data, error } = await supabase.from('students').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  // ลบนักเรียน
  async deleteStudent(id: string): Promise<void> {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
  },
}
