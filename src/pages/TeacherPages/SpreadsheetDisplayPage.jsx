import Layout from "@/components/layout"
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { getSpreadsheetById } from "@/services/teacher/spreadsheetServices";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpreadsheetDisplayPage() {
    const { id } = useParams();
    const { getAuthHeader } = useAuth();
    const [spreadsheetData, setSpreadsheetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchSpreadsheetData = async () => {
            console.log("SpreadsheetDisplayPage - Current ID param:", id);
            
            if (!id || id === 'undefined') {
                setError(`Invalid spreadsheet ID: ${id}`);
                setLoading(false);
                return;
            }

            try {
                console.log("Attempting to fetch spreadsheet with ID:", id);
                const data = await getSpreadsheetById(id, getAuthHeader());
                console.log("Fetched spreadsheet data:", data);
                
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
            // Filter out non-grade columns if needed
            const excludedFields = ['id', 'studentNumber', 'Student Number', 'First Name', 'Last Name'];
            return Object.keys(firstRecord.grades).filter(key => !excludedFields.includes(key));
        }
        
        return [];
    };

    const renderTableHeaders = () => {
        const gradeColumns = getGradeColumns();
        
        return (
            <tr className="bg-gray-100 border-b">
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
            <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{record.studentNumber || record.grades?.["Student Number"] || ""}</td>
                <td className="p-3">{record.grades?.["First Name"] || ""}</td>
                <td className="p-3">{record.grades?.["Last Name"] || ""}</td>
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
                <div className="p-4">
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
                <div className="p-4">
                    <h1 className="text-xl md:text-2xl font-bold">No Data Found</h1>
                    <p className="mt-2">The spreadsheet data could not be loaded.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl md:text-2xl font-bold">
                        {spreadsheetData.className || "Spreadsheet Data"}
                    </h1>
                    <span className="text-sm text-gray-500">
                        File: {spreadsheetData.fileName || "Untitled"}
                    </span>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow transition-all duration-300 ease-in-out">
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