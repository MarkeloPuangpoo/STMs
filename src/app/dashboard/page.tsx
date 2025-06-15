'use client'

import { useState, useEffect } from 'react'
import { studentService } from '@/services/studentService'
import {
  RiUserLine,
  RiBookOpenLine,
  RiGroupLine,
  RiBarChartBoxLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiCalendarLine,
  RiSettings4Line,
  RiNotification3Line,
  RiSearchLine,
  RiFilter3Line,
  RiDashboardLine,
  RiSchoolLine,
  RiTeamLine,
  RiFileChartLine
} from 'react-icons/ri'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
      } catch (err: any) {
        setError(err.message)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          <p className="text-sm text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            แดชบอร์ด
          </h1>
          <p className="text-slate-600 mt-2 text-sm lg:text-base">
            ภาพรวมของระบบจัดการนักเรียน
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              type="search"
              placeholder="ค้นหา..."
              className="pl-10 w-full bg-white/50 backdrop-blur-sm border-slate-200"
            />
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-slate-200 h-9 w-9">
              <RiFilter3Line className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-slate-200 h-9 w-9">
              <RiNotification3Line className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-slate-200 h-9 w-9">
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
            <Card key={index} className="relative overflow-hidden border-none bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className="p-2 rounded-full bg-slate-100/50">
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-slate-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={stat.trend.isPositive ? "success" : "destructive"} className="px-2 py-1 text-xs">
                      <TrendIcon className="mr-1 h-3 w-3" />
                      {stat.trend.value}
                    </Badge>
                    <span className="text-xs lg:text-sm text-slate-500">
                      {stat.trend.text}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 to-slate-50"></div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Student Growth Chart */}
        <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
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
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
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
                    stroke="#0F172A"
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Class Distribution Chart */}
        <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
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
                    fill="#8884d8"
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