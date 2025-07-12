'use client'

import { useState, useEffect, useMemo } from 'react'
import { studentService } from '@/services/studentService'
import { Student } from '@/types/student' // Import the Student type
import {
  RiUserLine,
  RiBookOpenLine,
  RiGroupLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiAlertLine
} from 'react-icons/ri'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

// FIX: Updated interface for recharts compatibility
interface ClassStats {
  name: string;
  value: number;
}

// Mock data for trends
const trendData = [
  { month: 'ม.ค.', students: 120 },
  { month: 'ก.พ.', students: 150 },
  { month: 'มี.ค.', students: 180 },
  { month: 'เม.ย.', students: 200 },
  { month: 'พ.ค.', students: 220 },
  { month: 'มิ.ย.', students: 240 }
]

const COLORS = ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

// Reusable Components
const StatCard = ({ icon, title, value, trendValue, isPositive, trendText }: { icon: React.ReactNode, title: string, value: number | string, trendValue: string, isPositive: boolean, trendText: string }) => {
    const TrendIcon = isPositive ? RiArrowUpLine : RiArrowDownLine;
    return (
      <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</CardTitle>
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={isPositive ? "success" : "destructive"} className="text-xs">
              <TrendIcon className="mr-1 h-3 w-3" />
              {trendValue}
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">{trendText}</span>
          </div>
        </CardContent>
      </Card>
    )
}

const ChartCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">{children}</div>
      </CardContent>
    </Card>
)

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="label font-semibold">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
};

// Main Component
export default function DashboardPage() {
  const [totalStudents, setTotalStudents] = useState(0)
  const [classStats, setClassStats] = useState<ClassStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        // FIX: Changed from getAllStudents to getStudents
        const students = await studentService.getStudents();
        console.log("[DASHBOARD] students.length =", students.length, students.map(s => s.class))
        setTotalStudents(students.length)

        // FIX: Added explicit type for 'student' and accumulator
        const stats = students.reduce((acc: { [key: string]: number }, student: Student) => {
          acc[student.class] = (acc[student.class] || 0) + 1
          return acc
        }, {})

        // FIX: Mapped to the correct ClassStats interface { name, value }
        setClassStats(
          Object.entries(stats).map(([className, count]) => ({
            name: `ชั้น ${className}`,
            value: count,
          }))
        )
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const statsCards = useMemo(() => [
    {
      title: 'นักเรียนทั้งหมด',
      value: totalStudents,
      icon: <RiUserLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      trendValue: '+12.5%',
      isPositive: true,
      trendText: 'จากเดือนที่แล้ว'
    },
    {
      title: 'จำนวนชั้นเรียน',
      value: classStats.length,
      icon: <RiBookOpenLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      trendValue: '0%',
      isPositive: true,
      trendText: 'เท่าเดิม'
    },
    {
      title: 'เฉลี่ยต่อชั้น',
      value: classStats.length ? Math.round(totalStudents / classStats.length) : 0,
      icon: <RiGroupLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      trendValue: '-2.3%',
      isPositive: false,
      trendText: 'จากเดือนที่แล้ว'
    },
  ], [totalStudents, classStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg text-center">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><RiAlertLine/>เกิดข้อผิดพลาด</h3>
                <p>{error}</p>
            </div>
        </div>
    )
  }

  return (
    <div className="p-0 sm:p-4 lg:p-8 flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-xl px-8 py-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
            ยินดีต้อนรับ, Admin!
          </h1>
          <p className="text-blue-100 text-base lg:text-lg mb-6">
            ภาพรวมข้อมูลสำคัญของระบบจัดการนักเรียน
          </p>
          <Link href="/dashboard/students">
            <Button className="bg-white hover:bg-slate-100 text-blue-600 font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              จัดการข้อมูลนักเรียน
            </Button>
          </Link>
        </div>
        <div className="hidden md:block">
          <Image src="/logo.png" alt="Dashboard Illustration" width={200} height={150} className="rounded-xl object-cover" />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <ChartCard title="การเติบโตของจำนวนนักเรียน" description="แสดงแนวโน้มจำนวนนักเรียนที่เพิ่มขึ้นในแต่ละเดือน">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="students" stroke="#1d4ed8" fillOpacity={1} fill="url(#colorStudents)" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
        <div className="lg:col-span-2">
            <ChartCard title="สัดส่วนนักเรียนแต่ละชั้น" description="แสดงการกระจายตัวของนักเรียนในแต่ละชั้นเรียน">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    {/* FIX: Updated dataKey and nameKey */}
                    <Pie data={classStats} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                        {classStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
      </div>
    </div>
  )
}