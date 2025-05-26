import Layout from "@/components/layout"
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, Upload, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import React, { useState } from "react";
import { useAuth } from "@/contexts/authentication-context";
import { uploadSpreadsheet, processSpreadsheetUrl } from "@/services/teacher/spreadsheetservices";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SpreadsheetsPage() {
    const { currentUser, getAuthHeader } = useAuth();
    const fileInputRef = React.useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [sheetUrl, setSheetUrl] = useState("");
    const [isProcessingUrl, setIsProcessingUrl] = useState(false);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);
    const navigate = useNavigate();

    const isValidSpreadsheetUrl = (url) => {
        if (!url) return false;
        
        // Google Sheets URLs
        const googleSheetsPatterns = [
            /docs\.google\.com\/spreadsheets/,
            /sheets\.google\.com/
        ];
        
        // Microsoft Excel URLs
        const microsoftExcelPatterns = [
            /onedrive\.live\.com/,
            /1drv\.ms/,
            /sharepoint\.com/,
            /office\.com\/x\//,
            /excel\.office\.com/
        ];
        
        const allPatterns = [...googleSheetsPatterns, ...microsoftExcelPatterns];
        return allPatterns.some(pattern => pattern.test(url));
    };

    const getUrlProvider = (url) => {
        if (!url) return 'Unknown';
        
        if (url.includes('docs.google.com') || url.includes('sheets.google.com')) {
            return 'Google Sheets';
        }
        
        if (url.includes('onedrive.live.com') || 
            url.includes('1drv.ms') || 
            url.includes('sharepoint.com') || 
            url.includes('office.com') ||
            url.includes('excel.office.com')) {
            return 'Microsoft Excel';
        }
        
        return 'Unknown';
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            console.log("Selected file:", file);
            toast.success(`File "${file.name}" selected`, {
                duration: 3000,
                position: 'bottom-right',
                icon: '📄',
            });
        }
    }
    
    const handleButtonClick = async () => {
        if(selectedFile){
            setIsUploading(true);
            setError(null);
            
            // Show loading toast
            const loadingToast = toast.loading('Uploading spreadsheet...', {
                position: 'top-center'
            });
            
            try {
                console.log("Uploading file:", selectedFile);
                console.log("Teacher ID:", currentUser.userId);
                
                const response = await uploadSpreadsheet(
                    {file: selectedFile, teacherId: currentUser.userId},
                    getAuthHeader()
                );
                
                // Log the full response to see its structure
                console.log("File upload response:", response);
                
                // Check if response has the expected structure
                let spreadsheetId;
                if (response.id) {
                    spreadsheetId = response.id;
                } else if (response.spreadsheet && response.spreadsheet.id) {
                    spreadsheetId = response.spreadsheet.id;
                } else {
                    console.error("Could not find spreadsheet ID in response:", response);
                    toast.error("Upload successful but couldn't retrieve spreadsheet ID.", {
                        position: 'top-center'
                    });
                    setIsUploading(false);
                    setSelectedFile(null);
                    toast.dismiss(loadingToast);
                    return;
                }
                
                // Dismiss loading toast
                toast.dismiss(loadingToast);
                
                // Show success toast
                toast.success('Spreadsheet uploaded successfully!', {
                    duration: 3000,
                    position: 'top-center',
                });
                
                // Navigate with the extracted ID
                console.log("Navigating to spreadsheet display with ID:", spreadsheetId);
                navigate(`/teacher/spreadsheets/display/${spreadsheetId}`, { 
                    state: { fromUpload: true } 
                });
                
                setIsUploading(false);
                setSelectedFile(null);
            } catch (error) {
                console.error("Error uploading file:", error);
                
                // Dismiss loading toast
                toast.dismiss(loadingToast);
                
                // Set error state for UI display
                setError({
                    title: "Upload Failed",
                    message: error.message || "Unknown error occurred while uploading the file.",
                });
                
                // Show error toast
                toast.error(`Error uploading file: ${error.message || "Unknown error"}`, {
                    duration: 5000,
                    position: 'top-center',
                });
                
                setIsUploading(false);
            } 
        } else {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }
    };

    const handleUrlSubmit = async () => {
        if (!sheetUrl) {
            toast.error("Please enter a spreadsheet URL", {
                position: 'top-center'
            });
            return;
        }

        if (!isValidSpreadsheetUrl(sheetUrl)) {
            toast.error("Please provide a valid Google Sheets or Microsoft Excel Online URL.", {
                duration: 5000,
                position: 'top-center',
            });
            return;
        }

        setIsProcessingUrl(true);
        setError(null);
        setDebugInfo(null);
        
        const loadingToast = toast.loading('Processing spreadsheet URL...', {
            position: 'top-center'
        });

        try {
            // First, check if the URL is supported
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_TEACHER_SERVICE;
            const checkResponse = await axios.get(`${API_BASE_URL}/check-url-support`, {
                params: { url: sheetUrl },
                headers: getAuthHeader()
            });
            
            const checkResult = checkResponse.data;
            
            if (!checkResult.supported) {
                toast.dismiss(loadingToast);
                toast.error(`Unsupported spreadsheet URL. Please provide a valid Google Sheets or Microsoft Excel Online URL.`, {
                    duration: 5000,
                    position: 'top-center',
                });
                setIsProcessingUrl(false);
                return;
            }

            // Store debug info
            setDebugInfo({
                checkResponse: checkResult,
                detectedProvider: getUrlProvider(sheetUrl),
                urlValid: isValidSpreadsheetUrl(sheetUrl),
                requestUrl: `${API_BASE_URL}/process-url`,
                requestData: { url: sheetUrl, teacherId: currentUser.userId },
                headers: { ...getAuthHeader(), "Content-Type": "application/x-www-form-urlencoded" }
            });

            // Then process the URL
            const response = await processSpreadsheetUrl(
                { url: sheetUrl, teacherId: currentUser.userId },
                getAuthHeader()
            );

            console.log("URL processing response:", response);
            
            // Check if response has the expected structure
            let spreadsheetId;
            if (response.spreadsheet && response.spreadsheet.id) {
                spreadsheetId = response.spreadsheet.id;
            } else {
                console.error("Could not find spreadsheet ID in response:", response);
                toast.error("Processing successful but couldn't retrieve spreadsheet ID.", {
                    position: 'top-center'
                });
                setIsProcessingUrl(false);
                toast.dismiss(loadingToast);
                return;
            }
            
            // Dismiss loading toast
            toast.dismiss(loadingToast);
            
            // Show success toast
            toast.success(`Spreadsheet from ${response.provider || getUrlProvider(sheetUrl)} processed successfully!`, {
                duration: 3000,
                position: 'top-center',
            });
            
            // Navigate with the extracted ID
            console.log("Navigating to spreadsheet display with ID:", spreadsheetId);
            navigate(`/teacher/spreadsheets/display/${spreadsheetId}`, { 
                state: { fromLinkImport: true } 
            });
            
            setIsProcessingUrl(false);
            setSheetUrl("");
        } catch (error) {
            console.error("Error processing spreadsheet URL:", error);
            
            // Dismiss loading toast
            toast.dismiss(loadingToast);
            
            // Set error state for UI display
            setError({
                title: "Processing Failed",
                message: error.message || "Unknown error occurred while processing the URL.",
                details: error.response?.data || error.response?.statusText
            });
            
            // Show error toast
            const errorMessage = error.response?.data || error.message || "Unknown error";
            toast.error(`Error processing URL: ${errorMessage}`, {
                duration: 5000,
                position: 'top-center',
            });
            
            setIsProcessingUrl(false);
        }
    };

    const handleUrlChange = (event) => {
        setSheetUrl(event.target.value);
    };

    return (
        <Layout>
            {/* Toast container */}
            <Toaster />
            
            <div className='bg-gray-50 p-6 rounded-lg border mt-4 mb-4'>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Import Spreadsheet Data</h1>
                <p className="text-gray-600 mt-2">Upload or link a spreadsheet to import student grades</p>
            </div>
            
            {/* Error display */}
            {error && (
                <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-red-800">{error.title}</AlertTitle>
                    <AlertDescription className="text-red-700">
                        {error.message}
                        {error.details && (
                            <div className="mt-2 text-xs">
                                <details>
                                    <summary className="cursor-pointer hover:text-red-600">Technical Details</summary>
                                    <pre className="mt-2 whitespace-pre-wrap bg-red-100 p-2 rounded text-xs border">
                                        {typeof error.details === 'object' 
                                            ? JSON.stringify(error.details, null, 2) 
                                            : error.details}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </AlertDescription>
                </Alert>
            )}
            
            {/* Debug info (only in development) */}
            {import.meta.env.DEV && debugInfo && (
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                    <AlertTitle className="text-blue-800">Debug Information</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        <div className="space-y-2 text-sm">
                            <p><strong>Detected Provider:</strong> {debugInfo.detectedProvider}</p>
                            <p><strong>URL Valid:</strong> {debugInfo.urlValid ? 'Yes' : 'No'}</p>
                            <p><strong>Server Response:</strong> {debugInfo.checkResponse?.supported ? 'Supported' : 'Not Supported'}</p>
                        </div>
                        <details className="mt-2">
                            <summary className="cursor-pointer hover:text-blue-600">Full Debug Data</summary>
                            <pre className="mt-2 whitespace-pre-wrap bg-blue-100 p-2 rounded text-xs border">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </details>
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="bg-white rounded-lg border shadow-sm">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                        <TabsTrigger
                            value="upload"
                            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                        >
                            Upload Spreadsheet
                        </TabsTrigger>
                        <TabsTrigger
                            value="link"
                            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
                        >
                            Link Spreadsheet
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="p-6">
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                            <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Spreadsheet</h2>
                            <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                            <Button 
                                variant={selectedFile ? "default" : "outline"} 
                                className="mb-4 transition-all duration-300 hover:scale-105" 
                                onClick={handleButtonClick}
                                disabled={isUploading}
                            >
                                {selectedFile ? (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isUploading ? "Uploading..." : "Upload File"}
                                    </>
                                ) : (
                                    "Browse Files"
                                )}
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept=".xlsx, .csv" 
                                    className="hidden"
                                    onChange={handleFileChange} 
                                />
                            </Button>
                            {selectedFile && (
                                <div className="flex items-center bg-white px-3 py-2 rounded-md border transition-all duration-300 animate-in fade-in">
                                    <span className="mr-2">📄</span>
                                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                                </div>
                            )}
                            <p className="text-sm text-gray-500 mt-2">Supported formats: .xlsx, .csv</p>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="link" className="p-6">
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                            <LinkIcon className="w-12 h-12 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Spreadsheet</h2>
                            <p className="text-gray-600 mb-6">Enter the URL of your spreadsheet document</p>
                            
                            <div className="w-full max-w-md space-y-4">
                                <Input
                                    type="url"
                                    placeholder="https://docs.google.com/spreadsheets/... or https://onedrive.live.com/..."
                                    className="w-full"
                                    value={sheetUrl}
                                    onChange={handleUrlChange}
                                />
                                <Button 
                                    variant="default" 
                                    className="w-full transition-all duration-300 hover:scale-105" 
                                    onClick={handleUrlSubmit}
                                    disabled={isProcessingUrl || !sheetUrl}
                                >
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    {isProcessingUrl ? "Processing..." : "Import Spreadsheet"}
                                </Button>
                            </div>
                            
                            <div className="mt-6 text-sm text-gray-600 space-y-2">
                                <p className="font-medium">Supported services:</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Google Sheets</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Microsoft Excel Online</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        <span>OneDrive</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>SharePoint</span>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs">
                                    <strong>Note:</strong> Make sure your spreadsheet is shared with view access.
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}