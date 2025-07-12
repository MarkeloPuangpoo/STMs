'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Services and Types
import { studentService } from '@/services/studentService'
import { Student } from '@/types/student'

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Control } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton" // Assuming you have a Skeleton component
import { RiArrowLeftLine, RiUserLine, RiMailLine, RiPhoneLine, RiBookOpenLine, RiHashtag, RiAlertLine } from 'react-icons/ri'

// Validation Schema
const studentUpdateSchema = z.object({
  id: z.string(),
  student_id: z.string().min(1, 'กรุณากรอกรหัสนักเรียน'),
  first_name: z.string().min(1, 'กรุณากรอกชื่อจริง'),
  last_name: z.string().min(1, 'กรุณากรอกนามสกุล'),
  class: z.string().min(1, 'กรุณากรอกชั้นเรียน'),
  phone: z.string().optional(),
  email: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }).optional().or(z.literal('')),
})

// Reusable Form Field Component
const FormInput = ({ name, label, control, icon, placeholder }: { name: keyof z.infer<typeof studentUpdateSchema>, label: string, control: Control<z.infer<typeof studentUpdateSchema>>, icon: React.ReactNode, placeholder?: string }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="flex items-center gap-2">
            {icon} {label}
        </FormLabel>
        <FormControl>
          <Input placeholder={placeholder || label} {...field} value={field.value || ''} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

// Skeleton Loader Component
const EditStudentSkeleton = () => (
    <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="md:col-span-2 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="md:col-span-2 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
        </CardFooter>
    </Card>
)

// Main Component
export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string;

  const [student, setStudent] = useState<Student | null>(null)
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof studentUpdateSchema>>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: {
        id: '',
        student_id: '',
        first_name: '',
        last_name: '',
        class: '',
        phone: '',
        email: '',
    },
  })
  
  const { formState: { isSubmitting } } = form;

  const loadStudent = useCallback(async () => {
    if (!id) return;
    setStatus('loading');
    try {
      const data = await studentService.getStudentById(id);
      setStudent(data);
      form.reset(data);
      setStatus('success');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }, [id, form]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  const onSubmit = async (data: z.infer<typeof studentUpdateSchema>) => {
    try {
      await studentService.updateStudent(data);
      router.push('/dashboard/students');
      // Consider adding a success toast notification here
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (status === 'loading') return <EditStudentSkeleton />;

  if (status === 'error' || !student) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 p-8 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500">
        <RiAlertLine className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-red-700 dark:text-red-300">เกิดข้อผิดพลาด</h2>
        <p className="text-red-600 dark:text-red-400">{error || 'ไม่พบข้อมูลนักเรียน'}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <RiArrowLeftLine className="mr-2" /> กลับไปหน้าก่อนหน้า
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold">แก้ไขข้อมูลนักเรียน</h1>
                <p className="text-muted-foreground">
                    อัปเดตข้อมูลสำหรับ {student.first_name} {student.last_name}
                </p>
            </div>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/students')}>
                <RiArrowLeftLine className="mr-2 h-4 w-4" />
                กลับ
            </Button>
        </div>

        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput name="student_id" label="รหัสนักเรียน" control={form.control} icon={<RiHashtag />} />
                <FormInput name="class" label="ชั้นเรียน" control={form.control} icon={<RiBookOpenLine />} />
                <FormInput name="first_name" label="ชื่อ" control={form.control} icon={<RiUserLine />} />
                <FormInput name="last_name" label="นามสกุล" control={form.control} icon={<RiUserLine />} />
                <div className="md:col-span-2">
                    <FormInput name="phone" label="เบอร์โทรศัพท์ (ไม่บังคับ)" control={form.control} icon={<RiPhoneLine />} />
                </div>
                <div className="md:col-span-2">
                    <FormInput name="email" label="อีเมล (ไม่บังคับ)" control={form.control} icon={<RiMailLine />} />
                </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/students')}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
