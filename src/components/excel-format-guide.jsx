import React from 'react';
import { X, FileSpreadsheet, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import toast from "react-hot-toast";
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

export default function ExcelFormatGuide({ isOpen, onClose }) {
  if (!isOpen) return null;

  const showSuccessToast = (message, options = {}) => {
    toast(
      () => (
        <div className="flex items-center gap-3 p-1">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
        </div>
      ),
      {
        duration: options.duration || 4000,
        position: options.position || "bottom-center",
        style: {
          background: "white",
          border: "1px solid #f3f4f6",
          borderLeft: "3px solid #10b981",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "16px",
          padding: "8px",
          minWidth: "320px",
          maxWidth: "450px",
        },
      }
    );
  };

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    
    const data = [
      ['Student Number', 'First Name', 'Last Name', 'Q1', 'Q2', 'ME', 'Final Exam'],
      ['', '', '', 10, 20, 100, 100],
      ['22-4539-123', 'Derrick', 'Estopace', 8, 15, 92, 85],
      ['22-4539-124', 'Kent', 'Abadiano', 9, 18, 95, 90],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    ws['!cols'] = [
      { wch: 15 },
      { wch: 12 }, 
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Student Grades');
    
    XLSX.writeFile(wb, 'grade_template.xlsx');

    showSuccessToast('Template downloaded successfully!', { duration: 2000 });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border-l-4 border-l-green-600 dark:border-l-green-400 bg-white dark:bg-card shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 right-3 h-8 w-8 p-0 hover:bg-transparent hover:text-black-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl flex items-center gap-2 text-green-700 dark:text-green-300">
            <FileSpreadsheet className="h-5 w-5" /> Required Excel Format
          </CardTitle>
          <CardDescription className="text-green-800 dark:text-green-300 flex items-center justify-between">
            <span>Your spreadsheet must follow this exact two-row header structure:</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 border-green-600 text-green-700 hover:bg-green-500 dark:hover:bg-green-900/20 hover:border-green-500 transition-colors"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-green-300 dark:border-green-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-100 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/30">
                  <TableHead className="font-bold">A</TableHead>
                  <TableHead className="font-bold">B</TableHead>
                  <TableHead className="font-bold">C</TableHead>
                  <TableHead className="font-bold">D</TableHead>
                  <TableHead className="font-bold">E</TableHead>
                  <TableHead className="font-bold">F</TableHead>
                  <TableHead className="font-bold">...</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Row 1: Headers */}
                <TableRow className="bg-white dark:bg-card hover:bg-white dark:hover:bg-card">
                  <TableCell className="font-medium text-green-700">Student Number</TableCell>
                  <TableCell className="font-medium text-green-700">First Name</TableCell>
                  <TableCell className="font-medium text-green-700">Last Name</TableCell>
                  <TableCell className="font-medium bg-yellow-50 dark:bg-yellow-950">Q1</TableCell>
                  <TableCell className="font-medium bg-yellow-50 dark:bg-yellow-950">Q2</TableCell>
                  <TableCell className="font-medium bg-yellow-50 dark:bg-yellow-950">ME</TableCell>
                  <TableCell className="font-medium text-green-700">...</TableCell>
                </TableRow>
                {/* Row 2: Max Values */}
                <TableRow className="bg-white dark:bg-card border-t border-dashed hover:bg-white dark:hover:bg-card">
                  <TableCell className="text-sm text-gray-500">
                    <Badge variant="outline" className="bg-white text-gray-500 border-gray-300 dark:bg-card hover:!bg-transparent hover:!text-inherit focus-visible:!ring-0">Leave Empty</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    <Badge variant="outline" className="bg-white text-gray-500 border-gray-300 dark:bg-card hover:!bg-transparent hover:!text-inherit focus-visible:!ring-0">Leave Empty</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    <Badge variant="outline" className="bg-white text-gray-500 border-gray-300 dark:bg-card hover:!bg-transparent hover:!text-inherit focus-visible:!ring-0">Leave Empty</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-lg bg-yellow-100 dark:bg-yellow-900">10</TableCell>
                  <TableCell className="font-bold text-lg bg-yellow-100 dark:bg-yellow-900">20</TableCell>
                  <TableCell className="font-bold text-lg bg-yellow-100 dark:bg-yellow-900">100</TableCell>
                  <TableCell className="text-sm text-gray-500">...</TableCell>
                </TableRow>
                {/* Row 3: Data */}
                <TableRow className="bg-white dark:bg-card hover:bg-white dark:hover:bg-card">
                  <TableCell>22-4539-123</TableCell>
                  <TableCell>Derrick</TableCell>
                  <TableCell>Estopace</TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>92</TableCell>
                  <TableCell>...</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <ul className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 space-y-1 pl-4 list-disc">
            <li><span className="font-bold">Row 1:</span> Must contain headers for all columns (e.g., Student Number, First Name, Last Name, Assessment Names).</li>
            <li><span className="font-bold">Row 2 (Maximum Scores):</span> Must contain the <u>maximum possible score/grade</u> for every assessment column (e.g., `100`, `20`). <span className="font-bold text-red-600">Leave columns A, B, and C empty.</span></li>
            <li><span className="font-bold">Mandatory Columns:</span> Your file must include columns for <span className="font-bold">Student Number</span>, <span className="font-bold">First Name</span>, and <span className="font-bold">Last Name</span>.</li>
            <li><span className="font-bold">Data Rows (Row 3 onwards):</span> Enter the actual student data and their scores.</li>
          </ul>

          <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border-red-500 rounded-md">
            <p className="text-xs font-semibold text-red-800 dark:text-red-300">
              ⚠️ Important: Only the first sheet of the Excel file will be read.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}