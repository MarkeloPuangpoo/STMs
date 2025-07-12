import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] font-sans">
      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/next.svg"
            alt="Student Management Logo"
            width={120}
            height={40}
            className="mb-2 dark:invert"
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
            Student Management System
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
            ระบบจัดการข้อมูลนักเรียนที่ทันสมัย ใช้งานง่าย ปลอดภัย และตอบโจทย์ทุกสถาบันการศึกษา
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
            <Link href="/login" className="inline-block rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 shadow transition-colors text-base">
              เข้าสู่ระบบ
            </Link>
            <Link href="/signup" className="inline-block rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold px-8 py-3 shadow transition-colors text-base">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <Image
            src="/image.png"
            alt="Student Illustration"
            width={340}
            height={220}
            className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 object-cover"
          />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-10 px-4 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <Image src="/file.svg" alt="จัดการข้อมูล" width={36} height={36} className="mb-1 dark:invert" />
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">จัดการข้อมูล</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">เพิ่ม แก้ไข ลบ ค้นหาข้อมูลนักเรียนได้อย่างรวดเร็ว</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Image src="/window.svg" alt="ใช้งานง่าย" width={36} height={36} className="mb-1 dark:invert" />
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">ใช้งานง่าย</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">อินเทอร์เฟซทันสมัย รองรับทุกอุปกรณ์</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Image src="/globe.svg" alt="ปลอดภัย" width={36} height={36} className="mb-1 dark:invert" />
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">ปลอดภัย</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">ข้อมูลถูกจัดเก็บอย่างปลอดภัยและเป็นส่วนตัว</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <span>© {new Date().getFullYear()} Student Management. Powered by Next.js & Vercel.</span>
      </footer>
    </div>
  );
}
