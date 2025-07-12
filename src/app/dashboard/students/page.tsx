'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { studentService } from '@/services/studentService'
import { Student, CreateStudentInput } from '@/types/student'
import {
  RiSearchLine, RiEditLine, RiDeleteBinLine,
  RiFilter3Line, RiDownloadLine, RiUserAddLine, RiAlertLine, RiInboxLine
} from 'react-icons/ri'

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Validation Schema
const studentSchema = z.object({
  student_id: z.string().min(1, 'กรุณากรอกรหัสนักเรียน'),
  first_name: z.string().min(1, 'กรุณากรอกชื่อ'),
  last_name: z.string().min(1, 'กรุณากรอกนามสกุล'),
  class: z.string().min(1, 'กรุณากรอกชั้นเรียน'),
  phone: z.string().optional(),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
})

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams();
  const classFromQuery = searchParams.get('class');
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>(classFromQuery || 'all');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(studentSchema),
  })

  // Fetch students based on current filters
  const loadStudents = useCallback(async (search: string, className: string) => {
    setStatus('loading');
    try {
      // FIX: Changed from getAllStudents to getStudents
      const data = await studentService.getStudents({
        searchQuery: search,
        selectedClass: className,
      });
      console.log("[STUDENTS] students.length =", data.length, data.map(s => s.class))
      setStudents(data);
      setStatus('success');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }, []);

  // Fetch available classes once on mount
  useEffect(() => {
    studentService.getAvailableClasses().then(setAvailableClasses);
  }, []);
  
  // Re-fetch students when filters change
  useEffect(() => {
    loadStudents(debouncedSearchQuery, selectedClass);
  }, [debouncedSearchQuery, selectedClass, loadStudents]);


  const onSubmit = async (data: CreateStudentInput) => {
    try {
      await studentService.createStudent(data)
      setIsAddModalOpen(false)
      reset()
      loadStudents(debouncedSearchQuery, selectedClass); // Reload current view
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentService.deleteStudent(studentToDelete.id)
      loadStudents(debouncedSearchQuery, selectedClass); // Reload current view
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsDeleteModalOpen(false)
      setStudentToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">ข้อมูลนักเรียน</CardTitle>
            <CardDescription>จัดการข้อมูลนักเรียนทั้งหมดในระบบ</CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <RiUserAddLine className="mr-2 h-4 w-4" /> เพิ่มนักเรียน
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>เพิ่มนักเรียนใหม่</DialogTitle>
                <DialogDescription>กรอกข้อมูลนักเรียนให้ครบถ้วนเพื่อเพิ่มเข้าระบบ</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="student_id">รหัสนักเรียน</Label>
                    <Input id="student_id" {...register('student_id')} />
                    {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="class">ชั้นเรียน</Label>
                    <Input id="class" {...register('class')} />
                    {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="first_name">ชื่อ</Label>
                    <Input id="first_name" {...register('first_name')} />
                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="last_name">นามสกุล</Label>
                    <Input id="last_name" {...register('last_name')} />
                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์ (ไม่บังคับ)</Label>
                    <Input id="phone" {...register('phone')} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="email">อีเมล (ไม่บังคับ)</Label>
                    <Input id="email" {...register('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>ยกเลิก</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-sm">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ค้นหาด้วยรหัส, ชื่อ, หรือนามสกุล..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <RiFilter3Line className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="กรองตามชั้นเรียน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกชั้นเรียน</SelectItem>
                  {availableClasses.map((c) => (
                    <SelectItem key={c} value={c}>ชั้น {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <RiDownloadLine className="mr-2 h-4 w-4" />
                    <span>นำออก</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <p>ส่งออกเป็น Excel (เร็วๆ นี้)</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <p>ส่งออกเป็น PDF (เร็วๆ นี้)</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">รหัสนักเรียน</TableHead>
                  <TableHead>ชื่อ - นามสกุล</TableHead>
                  <TableHead>ชั้นเรียน</TableHead>
                  <TableHead>ข้อมูลติดต่อ</TableHead>
                  <TableHead className="text-right w-[100px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === 'loading' && (
                  <TableRow>
                     <TableCell colSpan={5} className="h-48">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <Skeleton className="h-8 w-3/4" />
                           <Skeleton className="h-8 w-1/2" />
                           <Skeleton className="h-8 w-2/3" />
                        </div>
                     </TableCell>
                  </TableRow>
                )}
                {status === 'error' && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-red-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RiAlertLine className="w-10 h-10"/>
                        <span>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {status === 'success' && students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RiInboxLine className="w-10 h-10 text-slate-400"/>
                        <span>ไม่พบข้อมูลนักเรียนที่ตรงกับเงื่อนไข</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {status === 'success' && students.map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell className="font-mono">{student.student_id}</TableCell>
                    <TableCell className="font-medium">{`${student.first_name} ${student.last_name}`}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.class}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 text-xs">
                        <div>{student.phone || '-'}</div>
                        <div>{student.email || '-'}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => router.push(`/dashboard/students/${student.id}`)}>
                          <RiEditLine className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleDeleteClick(student)}>
                          <RiDeleteBinLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RiAlertLine className="text-red-500 h-6 w-6"/>
              ยืนยันการลบข้อมูล
            </AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของนักเรียน <span className="font-bold">{studentToDelete?.first_name} {studentToDelete?.last_name}</span>? การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">ยืนยันการลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function StudentsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentsPage />
    </Suspense>
  );
}