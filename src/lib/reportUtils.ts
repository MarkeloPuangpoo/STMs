import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { sarabunBase64 } from './fonts';
import { logoBase64 } from './logoImage'; // Import the logo
import { Student } from '@/types/student';

const FONT_PLACEHOLDER = sarabunBase64; 

const setupDocWithLogo = () => {
    const doc = new jsPDF();
    
    // Add Thai font
    if (FONT_PLACEHOLDER && FONT_PLACEHOLDER.length > 100) {
        doc.addFileToVFS('Sarabun-Regular.ttf', FONT_PLACEHOLDER);
        doc.addFont('Sarabun-Regular.ttf', 'Sarabun-Regular', 'normal');
        doc.setFont('Sarabun-Regular');
    }

    // Add School Logo
    // ตรวจสอบว่า logoBase64 มีข้อมูลและเป็น base64 string ของรูปภาพ
    if (logoBase64 && logoBase64.startsWith('data:image')) {
        // ปรับตำแหน่ง (x, y) และขนาด (width, height) ของโลโก้ตามต้องการ
        // ในที่นี้คือ x=175, y=15, width=20, height=20
        doc.addImage(logoBase64, 'PNG', 175, 15, 20, 20);
    }

    return doc;
}

/**
 * Downloads data as a CSV file.
 * @param data The array of objects to download.
 * @param filename The desired filename without extension.
 */
export const downloadCsv = (data: Record<string, unknown>[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates a PDF report for a list of students.
 * @param students The list of students.
 * @param title The title of the report.
 * @param filename The desired filename without extension.
 */
export const generateStudentListPdf = (students: Student[], title: string, filename: string) => {
  const doc = setupDocWithLogo(); // Use the new setup function with logo
  const tableColumn = ["รหัสนักเรียน", "ชื่อ", "นามสกุล", "ชั้นเรียน", "เบอร์โทร", "อีเมล"];
  const tableRows: (string | number)[][] = students.map(student => [
    student.student_id,
    student.first_name,
    student.last_name,
    student.class,
    student.phone || '-',
    student.email || '-',
  ]);

  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}`, 14, 28);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40, // Adjusted startY to make space for logo and title
    styles: { font: 'Sarabun-Regular', fontStyle: 'normal' },
    headStyles: { fillColor: [34, 197, 94] }, // Green color for header
  });

  doc.save(`${filename}.pdf`);
};

/**
 * Generates a PDF report for class statistics.
 * @param classStats Array of objects with class name and student count.
 * @param filename The desired filename without extension.
 */
export const generateClassStatsPdf = (classStats: { name: string, studentCount: number }[], filename: string) => {
    const doc = setupDocWithLogo(); // Use the new setup function with logo
    const tableColumn = ["ชื่อชั้นเรียน", "จำนวนนักเรียน (คน)"];
    const tableRows = classStats.map(stat => [stat.name, stat.studentCount]);
    const totalStudents = classStats.reduce((sum, stat) => sum + stat.studentCount, 0);

    doc.setFontSize(18);
    doc.text("รายงานสถิติจำนวนนักเรียน", 14, 22);
    doc.setFontSize(11);
    doc.text(`สร้างเมื่อ: ${new Date().toLocaleString('th-TH')}`, 14, 28);
    doc.text(`จำนวนนักเรียนทั้งหมด: ${totalStudents} คน`, 14, 34);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45, // Adjusted startY
        styles: { font: 'Sarabun-Regular', fontStyle: 'normal' },
        headStyles: { fillColor: [34, 197, 94] }, // Green color for header
    });

    doc.save(`${filename}.pdf`);
}
