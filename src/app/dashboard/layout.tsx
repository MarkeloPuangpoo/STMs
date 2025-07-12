'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  RiDashboardLine, RiSchoolLine, RiTeamLine, RiFileChartLine,
  RiSettings4Line, RiLogoutBoxLine, RiMenuLine, RiCloseLine,
  RiUser3Line, RiNotification3Line, RiSearchLine
} from 'react-icons/ri'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabase/client'

// --- Reusable Components for this Layout ---

// 1. NavItem Component
const NavItem = ({ href, icon, label, disabled = false }: { href: string, icon: React.ReactNode, label: string, disabled?: boolean }) => {
  const pathname = usePathname();
  const isActive = !disabled && pathname.startsWith(href);

  return (
    <Link
      href={disabled ? "#" : href}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800'
        }
        ${disabled
          ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
          : ''
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

// 2. ProfileDropdown Component
const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200 dark:border-blue-700">
          <RiUser3Line className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 text-left hidden lg:block">
          <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">ผู้ดูแลระบบ</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@example.com</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in-5 slide-in-from-bottom-2">
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
            <RiSettings4Line /> ตั้งค่าโปรไฟล์
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
            <RiLogoutBoxLine /> ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main DashboardLayout Component ---

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    const titles: { [key: string]: string } = {
      '/dashboard': 'ภาพรวมระบบ',
      '/dashboard/students': 'จัดการข้อมูลนักเรียน',
      '/dashboard/classes': 'จัดการชั้นเรียน',
      '/dashboard/reports': 'รายงาน',
    };
    return Object.keys(titles).find(key => pathname.startsWith(key)) ? titles[Object.keys(titles).find(key => pathname.startsWith(key))!] : "แดชบอร์ด";
  }, [pathname]);
  
  const navLinks = [
    { href: '/dashboard', icon: <RiDashboardLine className="h-5 w-5" />, label: 'แดชบอร์ด' },
    { href: '/dashboard/students', icon: <RiSchoolLine className="h-5 w-5" />, label: 'นักเรียน' },
    { href: '/dashboard/classes', icon: <RiTeamLine className="h-5 w-5" />, label: 'ชั้นเรียน' },
    { href: '/dashboard/reports', icon: <RiFileChartLine className="h-5 w-5" />, label: 'รายงาน' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Mobile Sidebar Toggle */}
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 lg:hidden shadow-lg"
        variant="outline"
        size="icon"
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? <RiCloseLine className="h-6 w-6" /> : <RiMenuLine className="h-6 w-6" />}
      </Button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <RiSchoolLine className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Student Mgmt.
          </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map(link => <NavItem key={link.href} {...link} />)}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <ProfileDropdown />
        </div>
      </aside>

      {/* Main Content */}
      <div className="transition-all duration-300 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="lg:hidden">
                <h1 className="text-xl font-bold">{pageTitle}</h1>
            </div>
            <div className="hidden lg:block">
                {/* Can add breadcrumbs here */}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input type="search" placeholder="ค้นหา..." className="pl-10 w-48 lg:w-64" />
              </div>
              <Button variant="ghost" size="icon" className="text-slate-500">
                <RiNotification3Line className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}