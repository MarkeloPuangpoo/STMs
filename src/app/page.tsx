import Image from "next/image";
import Link from "next/link";
import { RiOrganizationChart, RiShieldCheckLine, RiComputerLine, RiArrowRightLine } from 'react-icons/ri';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-white/50 dark:bg-slate-800/30 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4 border-2 border-blue-200 dark:border-blue-700">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-base">{children}</p>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-blue-950 font-sans text-slate-800 dark:text-slate-200">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/next.svg"
              alt="Student Management Logo"
              width={100}
              height={32}
              className="dark:invert"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              เข้าสู่ระบบ
            </Link>
            <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex items-center justify-center text-center px-4 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-lg mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">Student Management</span>
              <br/>
              System ที่ดีที่สุดสำหรับคุณ
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              ระบบจัดการข้อมูลนักเรียนที่ทันสมัย ใช้งานง่าย ปลอดภัย และตอบโจทย์ทุกสถาบันการศึกษา
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
              <Link href="/dashboard" className="group inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all text-lg transform hover:scale-105">
                เริ่มต้นใช้งาน
                <RiArrowRightLine className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <div className="mt-16 animate-fade-in-up animation-delay-300">
            <Image
              src="/image.png"
              alt="Student Illustration"
              width={500}
              height={320}
              className="rounded-2xl shadow-2xl border-4 border-white dark:border-slate-700 object-cover mx-auto"
              priority
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">ฟีเจอร์เด่นของเรา</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            เครื่องมือที่ทรงพลังในการบริหารจัดการข้อมูลนักเรียนของคุณให้เป็นเรื่องง่าย
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard title="จัดการข้อมูล" icon={<RiOrganizationChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />}>
              เพิ่ม แก้ไข ลบ ค้นหาข้อมูลนักเรียนได้อย่างรวดเร็วและมีประสิทธิภาพ
            </FeatureCard>
            <FeatureCard title="ใช้งานง่าย" icon={<RiComputerLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />}>
              อินเทอร์เฟซที่สวยงามทันสมัย ตอบสนองทุกการใช้งานบนทุกอุปกรณ์
            </FeatureCard>
            <FeatureCard title="ปลอดภัยสูงสุด" icon={<RiShieldCheckLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />}>
              ข้อมูลของท่านจะถูกจัดเก็บอย่างปลอดภัยและเป็นส่วนตัวตามมาตรฐาน
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-500 dark:text-gray-400 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Student Management System. All rights reserved.
          <br />
          <span className="text-xs">Powered by Next.js & Vercel.</span>
        </div>
      </footer>
    </div>
  );
}