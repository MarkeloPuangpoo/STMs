'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  RiFileTextLine, RiPieChart2Line, RiBarChartGroupedLine, RiUserSearchLine,
  RiCalendarEventLine, RiDownloadCloud2Line, RiFilter3Line, RiLoader4Line
} from 'react-icons/ri'

// Services and Types
import { studentService } from '@/services/studentService'
import { Student } from '@/types/student'
import { downloadCsv, generateStudentListPdf, generateClassStatsPdf } from '@/lib/reportUtils'

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

// --- Reusable Components ---
interface ReportCardInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: (format?: 'pdf' | 'csv') => void;
  isModalAction?: boolean;
  disabled?: boolean;
}

const ReportCard = ({ title, description, icon, action, isModalAction, disabled }: ReportCardInfo) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAction = async (format: 'pdf' | 'csv') => {
    setIsGenerating(true);
    try {
      // Small delay to show loading state, improving UX
      await new Promise(resolve => setTimeout(resolve, 100));
      action(format);
    } catch (error) {
      console.error("Failed to generate report:", error);
      // In a real app, show a toast notification for the error
    } finally {
      setIsGenerating(false);
    }
  };

  // Logic for which buttons to show
  const cardContent = isModalAction ? (
    <Button className="w-full" onClick={() => action()} disabled={disabled}>
      <RiFilter3Line className="mr-2 h-4 w-4" />
      เลือกเงื่อนไข...
    </Button>
  ) : (
    // FIX: Changed from "flex gap-2" to responsive classes
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button className="w-full" onClick={() => handleAction('pdf')} disabled={disabled || isGenerating}>
        {isGenerating ? <RiLoader4Line className="animate-spin mr-2"/> : <RiDownloadCloud2Line className="mr-2 h-4 w-4" />}
        PDF
      </Button>
      <Button className="w-full" variant="outline" onClick={() => handleAction('csv')} disabled={disabled || isGenerating}>
         {isGenerating ? <RiLoader4Line className="animate-spin mr-2"/> : <RiDownloadCloud2Line className="mr-2 h-4 w-4" />}
        CSV
      </Button>
    </div>
  );

  return (
    <Card className="flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">{icon}</div>
        <div>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <CardDescription className="mt-1 text-sm">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {cardContent}
      </CardContent>
    </Card>
  );
};


// --- Main Page Component ---
export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassReportModalOpen, setIsClassReportModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const studentData = await studentService.getStudents();
      setStudents(studentData);
    } catch (error) {
      console.error("Failed to load data for reports:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const classStats = useMemo(() => {
    const stats = students.reduce((acc: { [key: string]: number }, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(stats).map(([className, count]) => ({
      name: `ชั้น ${className}`,
      studentCount: count,
      className: className,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [students]);

  // --- Report Generation Handlers ---
  const handleAllStudentsReport = (format?: 'pdf' | 'csv') => {
    if (!format) return;
    const dataToExport = students.map(student => ({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      class: student.class,
      phone: student.phone || '-',
      email: student.email || '-',
    }));
    if (format === 'pdf') {
      generateStudentListPdf(students, 'รายงานข้อมูลนักเรียนทั้งหมด', 'all-students-report');
    } else {
      downloadCsv(dataToExport, 'all-students-report');
    }
  };

  const handleClassStatsReport = (format?: 'pdf' | 'csv') => {
    if (!format) return;
    const dataToExport = classStats.map(s => ({ "ชั้นเรียน": s.name, "จำนวนนักเรียน": s.studentCount }));
    if (format === 'pdf') {
        generateClassStatsPdf(classStats, 'class-statistics-report');
    } else {
        downloadCsv(dataToExport, 'class-statistics-report');
    }
  };
  
  const handleClassReport = (format: 'pdf' | 'csv') => {
      if (!selectedClass) return;
      const classStudents = students.filter(s => s.class === selectedClass);
      const dataToExport = classStudents.map(student => ({
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        class: student.class,
        phone: student.phone || '-',
        email: student.email || '-',
      }));

      if (format === 'pdf') {
          generateStudentListPdf(classStudents, `รายงานข้อมูลนักเรียนชั้น ${selectedClass}`, `class-${selectedClass}-report`);
      } else {
          downloadCsv(dataToExport, `class-${selectedClass}-report`);
      }
      setIsClassReportModalOpen(false);
      setSelectedClass('');
  }

  const reportList: ReportCardInfo[] = [
    {
      id: 'all-students',
      title: 'สรุปข้อมูลนักเรียนทั้งหมด',
      description: 'ไฟล์ PDF หรือ CSV ที่มีข้อมูลนักเรียนทุกคนในระบบ',
      icon: <RiFileTextLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      action: handleAllStudentsReport,
      disabled: isLoading,
    },
    {
      id: 'class-stats',
      title: 'สถิติจำนวนนักเรียน',
      description: 'รายงานสรุปจำนวนนักเรียนในแต่ละชั้นเรียน',
      icon: <RiPieChart2Line className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      action: handleClassStatsReport,
      disabled: isLoading,
    },
    {
        id: 'by-class',
        title: 'รายงานตามชั้นเรียน',
        description: 'กรองและสร้างรายงานสำหรับนักเรียนในชั้นเรียนที่ระบุ',
        icon: <RiBarChartGroupedLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
        action: () => setIsClassReportModalOpen(true),
        isModalAction: true,
        disabled: isLoading,
    },
    {
      id: 'contacts',
      title: 'ข้อมูลติดต่อผู้ปกครอง',
      description: 'สร้างรายชื่อและข้อมูลติดต่อสำหรับผู้ปกครองทั้งหมด',
      icon: <RiUserSearchLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      action: () => {},
      disabled: true,
    },
    {
      id: 'attendance',
      title: 'รายงานการเข้าเรียน',
      description: 'สรุปข้อมูลการเข้าเรียนของนักเรียน (รายวัน/รายเดือน)',
      icon: <RiCalendarEventLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      action: () => {},
      disabled: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">ศูนย์รายงาน</CardTitle>
          <CardDescription>เลือกและสร้างรายงานต่างๆ ที่คุณต้องการได้จากที่นี่</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-48 w-full"/>)}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportList.map((report) => (
                <ReportCard key={report.id} {...report} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for Class-specific Report */}
      <Dialog open={isClassReportModalOpen} onOpenChange={setIsClassReportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เลือกชั้นเรียนสำหรับรายงาน</DialogTitle>
            <DialogDescription>
              โปรดเลือกชั้นเรียนที่คุณต้องการสร้างรายงานข้อมูลนักเรียน
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select onValueChange={setSelectedClass} value={selectedClass}>
                <SelectTrigger>
                    <SelectValue placeholder="เลือกชั้นเรียน..." />
                </SelectTrigger>
                <SelectContent>
                    {classStats.map(c => (
                        <SelectItem key={c.className} value={c.className}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClassReportModalOpen(false)}>ยกเลิก</Button>
            <div className="flex gap-2">
                <Button onClick={() => handleClassReport('pdf')} disabled={!selectedClass}>สร้าง PDF</Button>
                <Button variant="secondary" onClick={() => handleClassReport('csv')} disabled={!selectedClass}>สร้าง CSV</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
