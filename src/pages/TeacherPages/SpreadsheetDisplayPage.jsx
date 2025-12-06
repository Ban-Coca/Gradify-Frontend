import Layout from "@/components/layout"
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { getSpreadsheetById } from "@/services/teacher/spreadsheetservices";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function SpreadsheetDisplayPage() {
    const { id } = useParams();
    const { getAuthHeader } = useAuth();
    const [spreadsheetData, setSpreadsheetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const helmet = useDocumentTitle("Spreadsheet", "View detailed spreadsheet data and grades.");

    useEffect(() => {

        const fetchSpreadsheetData = async () => {
            
            
            if (!id || id === 'undefined') {
                setError(`Invalid spreadsheet ID: ${id}`);
                setLoading(false);
                return;
            }

            try {
                
                const data = await getSpreadsheetById(id, getAuthHeader());
                
                
                // Check if we got valid data back
                if (!data) {
                    setError("Empty response received from server");
                    setLoading(false);
                    return;
                }
                
                // If the API returns the data wrapped in an "Optional" object (Java Optional)
                // Extract it properly
                const spreadsheetData = data.present === true ? data.get : data;
                
                setSpreadsheetData(spreadsheetData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching spreadsheet:", err);
                setError(`Failed to load spreadsheet data: ${err.message || "Unknown error"}`);
                setLoading(false);
            }
        };

        fetchSpreadsheetData();
    }, [id, getAuthHeader]);

    // Extract grade columns from the first record's grades object
    const getGradeColumns = () => {
        if (!spreadsheetData || !spreadsheetData.gradeRecords || spreadsheetData.gradeRecords.length === 0) {
            return [];
        }
        
        const firstRecord = spreadsheetData.gradeRecords[0];
        
        // Check if grades is an object and extract its keys
        if (firstRecord.grades && typeof firstRecord.grades === 'object') {
            // Create a set of excluded fields in lowercase for easier comparison
            const excludedFields = new Set([
                'id', 'studentnumber', 'student number', 
                'first name', 'last name', 'firstname', 'lastname',
                'name', 'full name', 'fullname',
                'project id', 'number', 'student id'
            ]);
            
            const allKeys = Object.keys(firstRecord.grades);
            console.log('All grade keys:', allKeys);
            console.log('Excluded fields:', Array.from(excludedFields));
            
            const filteredKeys = allKeys.filter(key => {
                const isExcluded = excludedFields.has(key.toLowerCase());
                return !isExcluded;
            });
            
            console.log('Final filtered keys (grade columns):', filteredKeys);
            return filteredKeys;
        }
        
        return [];
    };

    const renderTableHeaders = () => {
        const gradeColumns = getGradeColumns();
        
        return (
            <tr className="bg-gray-100 dark:bg-accent border-b">
                <th className="p-3 text-left">Student Number</th>
                <th className="p-3 text-left">First Name</th>
                <th className="p-3 text-left">Last Name</th>
                {gradeColumns.map((column) => (
                    <th key={column} className="p-3 text-left">{column}</th>
                ))}
            </tr>
        );
    };

    const renderTableRows = () => {
        if (!spreadsheetData || !spreadsheetData.gradeRecords) return null;
        
        const gradeColumns = getGradeColumns();
        
        return spreadsheetData.gradeRecords.map((record) => (
            <tr key={record.id} className="border-b hover:bg-gray-50 hover:dark:bg-accent">
                <td className="p-3">{record.studentNumber || record.grades?.["Student Number"] || ""}</td>
                <td className="p-3">
                    {record.grades?.["First Name"] || 
                     record.grades?.["FirstName"] || 
                     record.grades?.["FIRSTNAME"] || 
                     record.grades?.["NAME"] || ""}
                </td>
                <td className="p-3">
                    {record.grades?.["Last Name"] || 
                     record.grades?.["LastName"] || 
                     record.grades?.["LASTNAME"] || ""}
                </td>
                {gradeColumns.map((column) => (
                    <td key={`${record.id}-${column}`} className="p-3">
                        {/* Convert any non-string values to string */}
                        {record.grades && record.grades[column] !== undefined ? 
                            String(record.grades[column]) : ""}
                    </td>
                ))}
            </tr>
        ));
    };

    // Loading state
    if (loading) {
        return (
            <Layout>
                {helmet}
                <div className="p-4">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-24 w-full mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </Layout>
        );
    }

    // Error state
    if (error) {
        return (
            <Layout>
                {helmet}
                <div className="p-4 ">
                    <h1 className="text-xl md:text-2xl font-bold text-red-500">Error</h1>
                    <p className="mt-2">{error}</p>
                </div>
            </Layout>
        );
    }

    // No data state
    if (!spreadsheetData) {
        return (
            <Layout>
                {helmet}
                <div className="p-4">
                    <h1 className="text-xl md:text-2xl font-bold">No Data Found</h1>
                    <p className="mt-2">The spreadsheet data could not be loaded.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {helmet}
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl md:text-2xl font-bold">
                        {spreadsheetData.className || "Spreadsheet Data"}
                    </h1>
                    <span className="text-sm text-gray-500">
                        File: {spreadsheetData.fileName || "Untitled"}
                    </span>
                </div>

                <div className="overflow-x-auto bg-white dark:bg-card rounded-lg shadow transition-all duration-300 ease-in-out">
                    <table className="min-w-full">
                        <thead>
                            {renderTableHeaders()}
                        </thead>
                        <tbody>
                            {renderTableRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}