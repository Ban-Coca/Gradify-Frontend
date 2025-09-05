import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
    
    // These are the fields we don't want to display in the grades columns
    const excludedFields = ['Student Number', 'First Name', 'Last Name'];
    
    const {
        data: spreadsheet,
        isLoading: loading,
        error,
        isError,
        refetch
    } = useQuery({
        queryKey: ['spreadsheet', id],
        queryFn: () => getSpreadsheetById(id, getAuthHeader()),
        enabled: !!id, // Only run query if id exists
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        retry: 2 // Retry failed requests 2 times
    });
    
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
    
    if (isError) {
        return (
            <Layout>
                <div className="p-8">
                    <Alert className="border-red-200 bg-red-50 mb-6">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {(() => {
                                const errorData = error?.response?.data;
                                
                                // Check if it's a detailed error with specific information
                                if (errorData?.errorCode && errorData?.details) {
                                    return (
                                        <div className="space-y-2">
                                            <div className="font-semibold">
                                                {errorData.message || "Failed to load spreadsheet"}
                                            </div>
                                            <div className="text-sm">
                                                Error Code: {errorData.errorCode}
                                            </div>
                                            {errorData.details.errors && (
                                                <div className="grid grid-cols-1 gap-2">
                                                    {errorData.details.errors.map((detailError, index) => (
                                                        <div
                                                            key={index}
                                                            className="text-sm bg-red-100 p-2 rounded border-l-4 border-red-400"
                                                        >
                                                            {detailError.message || detailError}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                
                                // Fallback to generic error message
                                return (
                                    <div className="space-y-2">
                                        <div className="font-semibold">
                                            Failed to load spreadsheet data
                                        </div>
                                        <div className="text-sm">
                                            {errorData?.message || 
                                             error?.message || 
                                             "An unexpected error occurred. Please try again."}
                                        </div>
                                        {error?.response?.status && (
                                            <div className="text-xs text-red-600">
                                                HTTP {error.response.status}: {error.response.statusText}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </AlertDescription>
                    </Alert>
                    
                    <div className="flex gap-4 justify-center">
                        <Button 
                            variant="outline"
                            onClick={() => refetch()}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Try Again
                        </Button>
                        <Button 
                            onClick={() => navigate('/teacher/spreadsheets')}
                            className="flex items-center gap-2"
                        >
                            Back to Spreadsheets
                        </Button>
                    </div>
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