'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { studentService } from '@/services/studentService'
import { Student, UpdateStudentInput } from '@/types/student'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { use } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RiUserLine, RiMailLine, RiPhoneLine, RiBookOpenLine, RiNumbersLine } from 'react-icons/ri'

// สร้าง schema แบบไม่ต้องระบุ generic
const studentSchema = z.object({
  id: z.string(),
  student_id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  class: z.string(),
  phone: z.string().optional(),
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง').optional().or(z.literal('')),
})

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStudentInput>({
    resolver: zodResolver(studentSchema),
  })

  // โหลดข้อมูลนักเรียน
  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true)
        const data = await studentService.getStudentById(id)
        setStudent(data)
        reset(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadStudent()
  }, [id, reset])

  // อัพเดทข้อมูลนักเรียน
  const onSubmit = async (data: UpdateStudentInput) => {
    try {
      await studentService.updateStudent(data)
      router.push('/dashboard/students')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          ไม่พบข้อมูลนักเรียน
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] flex items-center justify-center py-8 px-2">
      <Card className="w-full max-w-xl shadow-xl border-0 bg-white/90 dark:bg-slate-900/90">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="bg-blue-100 rounded-full p-3 mb-2"><RiUserLine className="h-7 w-7 text-blue-600" /></div>
          <CardTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">
            แก้ไขข้อมูลนักเรียน
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register('id')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_id"><RiNumbersLine className="inline mr-1 text-blue-400" />รหัสนักเรียน</Label>
                <Input id="student_id" {...register('student_id')} placeholder="รหัสนักเรียน" />
                {errors.student_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.student_id.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="class"><RiBookOpenLine className="inline mr-1 text-blue-400" />ชั้นเรียน</Label>
                <Input id="class" {...register('class')} placeholder="ชั้นเรียน" />
                {errors.class && (
                  <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="first_name"><RiUserLine className="inline mr-1 text-blue-400" />ชื่อ</Label>
                <Input id="first_name" {...register('first_name')} placeholder="ชื่อ" />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="last_name"><RiUserLine className="inline mr-1 text-blue-400" />นามสกุล</Label>
                <Input id="last_name" {...register('last_name')} placeholder="นามสกุล" />
                {errors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone"><RiPhoneLine className="inline mr-1 text-blue-400" />เบอร์โทรศัพท์</Label>
                <Input id="phone" {...register('phone')} placeholder="เบอร์โทรศัพท์" />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email"><RiMailLine className="inline mr-1 text-blue-400" />อีเมล</Label>
                <Input id="email" {...register('email')} placeholder="อีเมล" />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
            <CardFooter className="flex justify-end gap-3 px-0 pt-6">
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/students')}>
                ยกเลิก
              </Button>
              <Button type="submit" variant="default">
                บันทึก
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}