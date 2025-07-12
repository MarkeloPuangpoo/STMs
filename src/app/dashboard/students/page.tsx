'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { studentService } from '@/services/studentService'
import { Student, CreateStudentInput } from '@/types/student'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  RiAddLine,
  RiSearchLine,
  RiEditLine,
  RiDeleteBinLine,
  RiFilterLine,
  RiDownloadLine
} from 'react-icons/ri'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// สร้าง schema สำหรับการ validate ข้อมูล
const studentSchema = z.object({
  student_id: z.string().min(1, 'กรุณากรอกรหัสนักเรียน'),
  first_name: z.string().min(1, 'กรุณากรอกชื่อ'),
  last_name: z.string().min(1, 'กรุณากรอกนามสกุล'),
  class: z.string().min(1, 'กรุณากรอกชั้นเรียน'),
  phone: z.string().optional(),
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง').optional().or(z.literal('')),
})

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(studentSchema),
  })

  // โหลดข้อมูลนักเรียน
  const loadStudents = async () => {
    try {
      const data = await studentService.getAllStudents()
      setStudents(data)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  // ค้นหานักเรียน
  const handleSearch = async (query: string) => {
    try {
      if (query.trim()) {
        const results = await studentService.searchStudents(query)
        setStudents(results)
      } else {
        await loadStudents()
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  // เพิ่มนักเรียนใหม่
  const onSubmit = async (data: CreateStudentInput) => {
    try {
      await studentService.createStudent(data)
      setIsModalOpen(false)
      reset()
      await loadStudents()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  // ลบนักเรียน
  const handleDelete = async (id: string) => {
    if (window.confirm('คุณต้องการลบข้อมูลนักเรียนคนนี้ใช่หรือไม่?')) {
      try {
        await studentService.deleteStudent(id)
        await loadStudents()
      } catch (err) {
        setError((err as Error).message)
      }
    }
  }

  // กรองนักเรียนตามชั้นเรียน
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(student => student.class === selectedClass)

  // รายการชั้นเรียนที่มี
  const classes = Array.from(new Set(students.map(student => student.class))).sort()

  useEffect(() => {
    loadStudents()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] p-0 sm:p-4 lg:p-8 flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/70 dark:bg-slate-900/70 rounded-2xl shadow-lg px-6 py-8 mb-8 border border-slate-100 dark:border-slate-800">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 mb-2 drop-shadow-sm">
            จัดการข้อมูลนักเรียน
          </h1>
          <p className="text-slate-700 dark:text-slate-300 text-base lg:text-lg mb-4">
            เพิ่ม แก้ไข ค้นหา และจัดการข้อมูลนักเรียนได้อย่างง่ายดาย
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors">
              <RiAddLine className="mr-2 h-5 w-5" /> เพิ่มนักเรียน
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>เพิ่มนักเรียนใหม่</DialogTitle>
              <DialogDescription>กรอกข้อมูลนักเรียนให้ครบถ้วน</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student_id">รหัสนักเรียน</Label>
                  <Input id="student_id" {...register('student_id')} placeholder="รหัสนักเรียน" />
                  {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id.message}</p>}
                </div>
                <div>
                  <Label htmlFor="class">ชั้นเรียน</Label>
                  <Input id="class" {...register('class')} placeholder="ชั้นเรียน" />
                  {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
                </div>
                <div>
                  <Label htmlFor="first_name">ชื่อ</Label>
                  <Input id="first_name" {...register('first_name')} placeholder="ชื่อ" />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="last_name">นามสกุล</Label>
                  <Input id="last_name" {...register('last_name')} placeholder="นามสกุล" />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" {...register('phone')} placeholder="เบอร์โทรศัพท์" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input id="email" {...register('email')} placeholder="อีเมล" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit" variant="default" disabled={isSubmitting}>
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-2">
          <div className="relative w-full sm:w-1/2">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ค้นหานักเรียน..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <RiFilterLine className="mr-2 h-4 w-4" />
                <SelectValue placeholder="เลือกชั้นเรียน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกชั้นเรียน</SelectItem>
                {classes.map((class_) => (
                  <SelectItem key={class_} value={class_}>
                    ชั้น {class_}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <RiDownloadLine className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">นำออก</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <RiDownloadLine className="mr-2 h-4 w-4" />
                  ส่งออก Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RiDownloadLine className="mr-2 h-4 w-4" />
                  ส่งออก PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-xl shadow bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50 dark:bg-slate-800">
                <TableHead>รหัส</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead>นามสกุล</TableHead>
                <TableHead>ชั้นเรียน</TableHead>
                <TableHead>เบอร์โทร</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead className="text-center">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                    ไม่พบนักเรียนในระบบ
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition">
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>{student.first_name}</TableCell>
                    <TableCell>{student.last_name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="flex gap-2 justify-center items-center">
                      <Button size="icon" variant="outline" onClick={() => router.push(`/dashboard/students/${student.id}`)} title="แก้ไข">
                        <RiEditLine className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(student.id)} title="ลบ">
                        <RiDeleteBinLine className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}