'use client'

import { useState } from 'react'
import {
  RiDashboardLine,
  RiSchoolLine,
  RiTeamLine,
  RiFileChartLine,
  RiSettings4Line,
  RiNotification3Line,
  RiSearchLine,
  RiFilter3Line,
  RiMenuLine,
  RiCloseLine,
  RiUserLine,
  RiLogoutBoxLine
} from 'react-icons/ri'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Dynamic title based on path
  const pathname = usePathname()
  let pageTitle = ""
  if (pathname === "/dashboard") pageTitle = "แดชบอร์ด"
  else if (pathname.startsWith("/dashboard/students")) pageTitle = "นักเรียน"
  else if (pathname.startsWith("/dashboard/classes")) pageTitle = "ชั้นเรียน"
  else if (pathname.startsWith("/dashboard/reports")) pageTitle = "รายงาน"
  else pageTitle = "แดชบอร์ด"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200 lg:hidden shadow-md"
        aria-label="เปิดเมนูนำทาง"
      >
        {isSidebarOpen ? (
          <RiCloseLine className="h-6 w-6 text-slate-600" />
        ) : (
          <RiMenuLine className="h-6 w-6 text-slate-600" />
        )}
      </button>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="ปิดเมนูนำทาง"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[280px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:w-64 lg:z-40`}
        aria-label="แถบเมนูนำทาง"
      >
        <div className="flex items-center gap-3 p-4 lg:p-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow">
            <RiSchoolLine className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
            Student Management
          </h2>
        </div>

        {/* Search Bar */}
        <div className="px-3 lg:px-4 mb-4 lg:mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="ค้นหา... (เร็ว ๆ นี้)"
              className="pl-10 w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 text-sm lg:text-base"
              disabled
            />
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-2 lg:px-4 space-y-1 lg:space-y-2">
          <Button asChild variant={pathname === "/dashboard" ? "secondary" : "ghost"} className={`w-full justify-start gap-2 text-slate-600 dark:text-slate-200 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 text-sm lg:text-base py-2 ${pathname === "/dashboard" ? 'bg-blue-100 dark:bg-slate-800 font-semibold' : ''}`}>
            <Link href="/dashboard">
              <RiDashboardLine className="h-5 w-5" />แดชบอร์ด
            </Link>
          </Button>
          <Button asChild variant={pathname.startsWith("/dashboard/students") ? "secondary" : "ghost"} className={`w-full justify-start gap-2 text-slate-600 dark:text-slate-200 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 text-sm lg:text-base py-2 ${pathname.startsWith("/dashboard/students") ? 'bg-blue-100 dark:bg-slate-800 font-semibold' : ''}`}>
            <Link href="/dashboard/students">
              <RiSchoolLine className="h-5 w-5" />นักเรียน
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm lg:text-base py-2 cursor-not-allowed" disabled>
            <RiTeamLine className="h-5 w-5" />ชั้นเรียน
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm lg:text-base py-2 cursor-not-allowed" disabled>
            <RiFileChartLine className="h-5 w-5" />รายงาน
          </Button>
        </nav>

        {/* Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                <RiUserLine className="h-5 w-5 text-blue-700" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">ผู้ดูแลระบบ</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">admin@example.com</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200">
                  <RiSettings4Line className="h-4 w-4" />
                  ตั้งค่า
                </button>
                <button className="w-full flex items-center gap-2 p-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                  <RiLogoutBoxLine className="h-4 w-4" />
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : ''
      }`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative flex items-center p-3 lg:p-4">
            {/* Centered Title */}
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg lg:text-xl font-semibold text-slate-900 dark:text-white text-center w-full pointer-events-none select-none">{pageTitle}</h1>
            {/* Right Buttons */}
            <div className="ml-auto flex items-center gap-2 relative z-10">
              <Button variant="outline" size="icon" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 h-8 w-8 lg:h-9 lg:w-9 cursor-not-allowed" disabled>
                <RiFilter3Line className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 h-8 w-8 lg:h-9 lg:w-9 cursor-not-allowed" disabled>
                <RiNotification3Line className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 