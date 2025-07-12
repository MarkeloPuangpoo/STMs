'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { studentService } from '@/services/studentService'
import { Student } from '@/types/student'
import {
  RiTeamLine, RiUserLine, RiArrowRightSLine, RiSearchLine, RiInboxLine, RiAlertLine
} from 'react-icons/ri'

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Interface for processed class data
interface ClassInfo {
  name: string;
  studentCount: number;
}

// Reusable Class Card Component
const ClassCard = ({ name, studentCount }: ClassInfo) => {
  const router = useRouter();

  // Navigate to students page with a filter for this class
  const handleViewStudents = () => {
    router.push(`/dashboard/students?class=${name}`);
  };

  return (
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-400">
          ชั้นเรียน {name}
        </CardTitle>
        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
          <RiTeamLine className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <RiUserLine />
          <span>มีนักเรียน {studentCount} คน</span>
        </div>
      </CardContent>
      <div className="p-4 pt-0">
        <Button variant="outline" className="w-full" onClick={handleViewStudents}>
          <span>ดูรายชื่อนักเรียน</span>
          <RiArrowRightSLine className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

// Skeleton Loader for Class Cards
const ClassGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-32" />
                </CardContent>
                <div className="p-4 pt-0">
                    <Skeleton className="h-10 w-full" />
                </div>
            </Card>
        ))}
    </div>
);


// Main Page Component
export default function ClassesPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const loadStudents = useCallback(async () => {
    setStatus('loading')
    try {
      // FIX: Changed from getAllStudents to getStudents
      const data = await studentService.getStudents()
      setAllStudents(data)
      setStatus('success')
    } catch (err) {
      setError((err as Error).message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  useEffect(() => {
    console.log("[CLASSES] allStudents.length =", allStudents.length, allStudents.map(s => s.class))
  }, [allStudents])

  // Process student data to get class statistics
  const classInfoList = useMemo(() => {
    if (!allStudents.length) return [];

    const stats = allStudents.reduce((acc: { [key: string]: number }, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1
      return acc
    }, {})

    let classList = Object.entries(stats).map(([className, count]) => ({
      name: className,
      studentCount: count,
    }));

    // Filter based on search query
    if (searchQuery.trim() !== '') {
        const lowercasedQuery = searchQuery.toLowerCase();
        classList = classList.filter(c => c.name.toLowerCase().includes(lowercasedQuery));
    }

    return classList.sort((a, b) => a.name.localeCompare(b.name));
  }, [allStudents, searchQuery])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">จัดการชั้นเรียน</CardTitle>
          <CardDescription>ภาพรวมและจำนวนนักเรียนในแต่ละชั้นเรียน</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full md:max-w-sm mb-6">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ค้นหาชั้นเรียน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {status === 'loading' && <ClassGridSkeleton />}
          
          {status === 'error' && (
            <div className="h-48 text-center text-red-500 flex flex-col items-center justify-center gap-2">
                <RiAlertLine className="w-10 h-10"/>
                <span>เกิดข้อผิดพลาด: {error}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classInfoList.length > 0 ? (
                classInfoList.map(info => <ClassCard key={info.name} {...info} />)
              ) : (
                <div className="col-span-full h-48 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                    <RiInboxLine className="w-10 h-10 text-slate-400"/>
                    <span>ไม่พบข้อมูลชั้นเรียน</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}