import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { getSpreadsheetById } from "@/services/teacher/spreadsheetservices";
import Layout from "@/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowUpDown, Download, Search, AlertTriangle, Edit } from "lucide-react";
import Pagination from "@/components/ui/pagination";

const ROWS_PER_PAGE = 15;

export default function SpreadsheetDisplayPage() {
    const { id } = useParams();
    const { getAuthHeader } = useAuth();
    const navigate = useNavigate();

    const [spreadsheetData, setSpreadsheetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'Student Number', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchSpreadsheetData = async () => {
            if (!id) {
                setError("Invalid spreadsheet ID.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await getSpreadsheetById(id, getAuthHeader());
                if (!data) {
                    throw new Error("Empty response received from the server.");
                }
                setSpreadsheetData(data);
            } catch (err) {
                console.error("Error fetching spreadsheet:", err);
                setError(`Failed to load spreadsheet data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchSpreadsheetData();
    }, [id, getAuthHeader]);

    const processedData = useMemo(() => {
        if (!spreadsheetData?.gradeRecords) return [];
        let filteredData = [...spreadsheetData.gradeRecords];
        if (searchTerm) {
            filteredData = filteredData.filter(record =>
                Object.values(record.grades).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                const aValue = a.grades[sortConfig.key] || "";
                const bValue = b.grades[sortConfig.key] || "";
                const isNumeric = !isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue));
                if (isNumeric) {
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
                }
                if (String(aValue) < String(bValue)) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (String(aValue) > String(bValue)) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredData;
    }, [spreadsheetData, searchTerm, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        return processedData.slice(startIndex, startIndex + ROWS_PER_PAGE);
    }, [processedData, currentPage]);
    
    const totalPages = Math.ceil(processedData.length / ROWS_PER_PAGE);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const getGradeColumns = () => {
        if (!spreadsheetData?.gradeRecords?.length) return [];
        const excludedFields = ['Student Number', 'First Name', 'Last Name'];
        const allKeys = new Set();
        spreadsheetData.gradeRecords.forEach(record => {
            Object.keys(record.grades).forEach(key => {
                if (!excludedFields.includes(key)) {
                    allKeys.add(key);
                }
            });
        });
        return Array.from(allKeys).sort();
    };

    const gradeColumns = getGradeColumns();

    const handleExportCSV = () => {
        const headers = ['Student Number', 'First Name', 'Last Name', ...gradeColumns];
        const rows = processedData.map(record => {
            return headers.map(header => {
                const value = record.grades[header] || "";
                // Handle values that might contain commas
                const escapedValue = String(value).includes(',') ? `"${value}"` : value;
                return escapedValue;
            }).join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${spreadsheetData?.className || 'grades'}-export.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="p-6 space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="p-6">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 sm:p-6 space-y-6">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-2xl">{spreadsheetData?.className || "Spreadsheet Data"}</CardTitle>
                            <CardDescription>
                                File: {spreadsheetData?.fileName || "Untitled"}
                            </CardDescription>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => navigate(`/teacher/classes/classdetail/${spreadsheetData?.classEntity?.classId}`)}
                            disabled={!spreadsheetData?.classEntity?.classId}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Grades
                        </Button>
                    </CardHeader>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search records..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" onClick={handleExportCSV}>
                                <Download className="mr-2 h-4 w-4" />
                                Export as CSV
                            </Button>
                        </div>
                        <div className="overflow-x-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {['Student Number', 'First Name', 'Last Name', ...gradeColumns].map((column) => (
                                            <TableHead key={column} className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort(column)}>
                                                <div className="flex items-center gap-1">
                                                    <span>{column}</span>
                                                    {sortConfig.key === column ? (
                                                        sortConfig.direction === 'ascending' ? (
                                                            <ArrowUpDown className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowUpDown className="h-4 w-4" />
                                                        )
                                                    ) : null}
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="text-left font-medium tabular-nums">{record.grades['Student Number'] || ''}</TableCell>
                                                <TableCell className="text-left">{record.grades['First Name'] || ''}</TableCell>
                                                <TableCell className="text-left">{record.grades['Last Name'] || ''}</TableCell>
                                                {gradeColumns.map(col => (
                                                    <TableCell key={`${record.id}-${col}`} className="text-left tabular-nums">
                                                        {record.grades[col] !== undefined ? String(record.grades[col]) : ""}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={gradeColumns.length + 3} className="h-24 text-center">
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {totalPages > 1 &&
                            <div className="flex justify-center mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        }
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}