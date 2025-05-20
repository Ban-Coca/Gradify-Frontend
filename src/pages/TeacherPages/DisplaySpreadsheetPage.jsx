import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate, useParams } from 'react-router-dom';
import Layout from "@/components/layout";
import { Loading } from '@/components/loading-state';
import { getSpreadsheetById } from '@/services/teacher/spreadsheetservices';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";

export default function DisplaySpreadsheetPage(){
    const { currentUser, getAuthHeader } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [spreadsheet, setSpreadsheet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // These are the fields we don't want to display in the grades columns
    const excludedFields = ['Student Number', 'First Name', 'Last Name'];
    
    useEffect(() => {
        const fetchSpreadsheet = async () => {
            try {
                setLoading(true);
                const data = await getSpreadsheetById(id, getAuthHeader());
                setSpreadsheet(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load spreadsheet data');
                setLoading(false);
            }
        };
        
        fetchSpreadsheet();
    }, [id]);
    
    // Get all unique column headers for the grades
    const getGradeColumns = () => {
        if (!spreadsheet?.gradeRecords?.length) return [];
        
        // Collect all unique keys from all grade records
        const allKeys = new Set();
        spreadsheet.gradeRecords.forEach(record => {
            Object.keys(record.grades).forEach(key => {
                if (!excludedFields.includes(key)) {
                    allKeys.add(key);
                }
            });
        });
        
        // Convert to array and sort
        return Array.from(allKeys).sort();
    };

    if (loading) {
        return <Layout><Loading fullscreen variant="spinner" size="xl" /></Layout>;
    }
    
    if (error) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <h2 className="text-red-500 text-xl font-bold mb-4">Error</h2>
                    <p>{error}</p>
                    <button 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate('/teacher/spreadsheets')}
                    >
                        Back to Spreadsheets
                    </button>
                </div>
            </Layout>
        );
    }
    
    const gradeColumns = getGradeColumns();
    
    return (
        <Layout>
            <div className="p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{spreadsheet.className}</h1>
                    <p className="text-gray-500">File: {spreadsheet.fileName}</p>
                </div>
                
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">Student Number</TableHead>
                                <TableHead className="font-bold">First Name</TableHead>
                                <TableHead className="font-bold">Last Name</TableHead>
                                {gradeColumns.map(column => (
                                    <TableHead key={column} className="font-bold">{column}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {spreadsheet.gradeRecords?.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.grades['Student Number']}</TableCell>
                                    <TableCell>{record.grades['First Name']}</TableCell>
                                    <TableCell>{record.grades['Last Name']}</TableCell>
                                    {gradeColumns.map(column => (
                                        <TableCell key={column}>
                                            {record.grades[column] || ''}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Layout>
    );
}