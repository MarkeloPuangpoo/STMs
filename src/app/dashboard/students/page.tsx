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
  RiCloseLine,
  RiFilterLine,
  RiDownloadLine,
  RiUploadLine
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
  const [loading, setLoading] = useState(true)
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
      setLoading(true)
      const data = await studentService.getAllStudents()
      setStudents(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ค้นหานักเรียน
  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      if (query.trim()) {
        const results = await studentService.searchStudents(query)
        setStudents(results)
      } else {
        await loadStudents()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // เพิ่มนักเรียนใหม่
  const onSubmit = async (data: CreateStudentInput) => {
    try {
      await studentService.createStudent(data)
      setIsModalOpen(false)
      reset()
      await loadStudents()
    } catch (err: any) {
      setError(err.message)
    }
  }

  // ลบนักเรียน
  const handleDelete = async (id: string) => {
    if (window.confirm('คุณต้องการลบข้อมูลนักเรียนคนนี้ใช่หรือไม่?')) {
      try {
        await studentService.deleteStudent(id)
        await loadStudents()
      } catch (err: any) {
        setError(err.message)
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
    <div className="space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">จัดการข้อมูลนักเรียน</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          เพิ่ม แก้ไข และลบข้อมูลนักเรียน
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
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

          <div className="flex flex-col sm:flex-row gap-4">
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <RiAddLine className="mr-2 h-4 w-4" />
                  เพิ่มนักเรียน
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>เพิ่มนักเรียนใหม่</DialogTitle>
                  <DialogDescription>
                    กรอกข้อมูลนักเรียนที่ต้องการเพิ่มในระบบ
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_id">รหัสนักเรียน</Label>
                    <Input
                      id="student_id"
                      {...register('student_id')}
                      className="w-full"
                    />
                    {errors.student_id && (
                      <p className="text-sm text-destructive">{errors.student_id.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="first_name">ชื่อ</Label>
                    <Input
                      id="first_name"
                      {...register('first_name')}
                      className="w-full"
                    />
                    {errors.first_name && (
                      <p className="text-sm text-destructive">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">นามสกุล</Label>
                    <Input
                      id="last_name"
                      {...register('last_name')}
                      className="w-full"
                    />
                    {errors.last_name && (
                      <p className="text-sm text-destructive">{errors.last_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">ชั้นเรียน</Label>
                    <Input
                      id="class"
                      {...register('class')}
                      className="w-full"
                    />
                    {errors.class && (
                      <p className="text-sm text-destructive">{errors.class.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="w-full"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      ยกเลิก
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden space-y-4">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-card rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{student.first_name} {student.last_name}</h3>
                  <p className="text-sm text-muted-foreground">รหัส: {student.student_id}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <RiEditLine className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/students/${student.id}`)}>
                      <RiEditLine className="mr-2 h-4 w-4" />
                      แก้ไข
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(student.id)}>
                      <RiDeleteBinLine className="mr-2 h-4 w-4" />
                      ลบ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">ชั้นเรียน</p>
                  <p>{student.class}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">เบอร์โทรศัพท์</p>
                  <p>{student.phone || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">อีเมล</p>
                  <p>{student.email || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสนักเรียน</TableHead>
                  <TableHead>ชื่อ-นามสกุล</TableHead>
                  <TableHead>ชั้นเรียน</TableHead>
                  <TableHead>เบอร์โทรศัพท์</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead className="w-[100px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>{student.first_name} {student.last_name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.phone || '-'}</TableCell>
                    <TableCell>{student.email || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/dashboard/students/${student.id}`)}
                        >
                          <RiEditLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(student.id)}
                        >
                          <RiDeleteBinLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
} 