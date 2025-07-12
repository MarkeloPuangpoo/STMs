'use client'

import { useState, useEffect } from 'react'
import { studentService } from '@/services/studentService'
import {
  RiUserLine,
  RiBookOpenLine,
  RiGroupLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiSettings4Line,
  RiNotification3Line,
  RiSearchLine,
  RiFilter3Line
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
  Cell
} from 'recharts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface ClassStats {
  class: string
  count: number
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

const COLORS = ['#0F172A', '#1E293B', '#334155', '#475569', '#64748B', '#94A3B8']

export default function DashboardPage() {
  const [totalStudents, setTotalStudents] = useState(0)
  const [classStats, setClassStats] = useState<ClassStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const students = await studentService.getAllStudents()
        setTotalStudents(students.length)

        // คำนวณจำนวนนักเรียนแต่ละชั้น
        const stats = students.reduce((acc: { [key: string]: number }, student) => {
          acc[student.class] = (acc[student.class] || 0) + 1
          return acc
        }, {})

        setClassStats(
          Object.entries(stats).map(([class_, count]) => ({
            class: class_,
            count,
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

  const stats = [
    {
      title: 'จำนวนนักเรียนทั้งหมด',
      value: totalStudents,
      icon: RiUserLine,
      description: 'นักเรียนที่ลงทะเบียนในระบบ',
      trend: {
        value: '+12.5%',
        isPositive: true,
        text: 'เพิ่มขึ้นจากเดือนที่แล้ว'
      }
    },
    {
      title: 'จำนวนชั้นเรียน',
      value: classStats.length,
      icon: RiBookOpenLine,
      description: 'ชั้นเรียนที่มีนักเรียน',
      trend: {
        value: '0%',
        isPositive: true,
        text: 'เท่ากับเดือนที่แล้ว'
      }
    },
    {
      title: 'นักเรียนต่อชั้นเรียน',
      value: classStats.length ? Math.round(totalStudents / classStats.length) : 0,
      icon: RiGroupLine,
      description: 'จำนวนนักเรียนเฉลี่ยต่อชั้นเรียน',
      trend: {
        value: '-2.3%',
        isPositive: false,
        text: 'ลดลงจากเดือนที่แล้ว'
      }
    },
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] p-0 sm:p-4 lg:p-8 flex flex-col">
      {/* Hero/Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/70 dark:bg-slate-900/70 rounded-2xl shadow-lg px-6 py-8 mb-8 border border-slate-100 dark:border-slate-800">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-blue-700 dark:text-blue-300 mb-2 drop-shadow-sm">
            ยินดีต้อนรับสู่แดชบอร์ด
          </h1>
          <p className="text-slate-700 dark:text-slate-300 text-base lg:text-lg mb-4">
            ตรวจสอบข้อมูลนักเรียนและสถิติต่าง ๆ ได้ที่นี่
          </p>
          <Link href="/dashboard/students">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors">
              จัดการนักเรียน
            </Button>
          </Link>
        </div>
        <div className="hidden md:block">
          <Image src="/image.png" alt="Dashboard Illustration" width={180} height={120} className="rounded-xl shadow border border-gray-200 dark:border-gray-700 object-cover" />
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 lg:mb-8">
        <div>
          <h2 className="text-xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            ภาพรวมระบบจัดการนักเรียน
          </h2>
          <p className="text-slate-600 mt-2 text-sm lg:text-base">
            ดูสถิติและแนวโน้มของนักเรียนในโรงเรียนของคุณ
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              type="search"
              placeholder="ค้นหา... (เร็ว ๆ นี้)"
              className="pl-10 w-full bg-white/50 backdrop-blur-sm border-slate-200"
              disabled
            />
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-slate-200 h-9 w-9" disabled>
              <RiFilter3Line className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-slate-200 h-9 w-9" disabled>
              <RiNotification3Line className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-slate-200 h-9 w-9" disabled>
              <RiSettings4Line className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 lg:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend.isPositive ? RiArrowUpLine : RiArrowDownLine
          return (
            <Card key={index} className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-200">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-full bg-blue-100/60 dark:bg-slate-700/60">
                  <Icon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={stat.trend.isPositive ? "success" : "destructive"} className="px-2 py-1 text-xs">
                      <TrendIcon className="mr-1 h-3 w-3" />
                      {stat.trend.value}
                    </Badge>
                    <span className="text-xs lg:text-sm text-slate-500 dark:text-slate-300">
                      {stat.trend.text}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 to-blue-50 dark:from-slate-700 dark:to-slate-900"></div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Student Growth Chart */}
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">การเติบโตของจำนวนนักเรียน</CardTitle>
            <CardDescription className="text-sm">
              แสดงจำนวนนักเรียนที่เพิ่มขึ้นในแต่ละเดือน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Class Distribution Chart */}
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">การกระจายตัวของนักเรียน</CardTitle>
            <CardDescription className="text-sm">
              แสดงจำนวนนักเรียนในแต่ละชั้นเรียน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#2563eb"
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {classStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}