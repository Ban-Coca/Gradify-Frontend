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
            toast.error("Please enter a Google Sheets URL", {
                position: 'top-center'
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
                toast.error(`Unsupported spreadsheet URL. Please provide a valid Google Sheets URL.`, {
                    duration: 5000,
                    position: 'top-center',
                });
                setIsProcessingUrl(false);
                return;
            }

            // Store debug info
            setDebugInfo({
                checkResponse: checkResult,
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
            toast.success(`Spreadsheet from ${response.provider || 'Google Sheets'} processed successfully!`, {
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
            
            <div className='bg-inherited p-4 rounded-lg mt-4 mb-4'>
                <h1 className="text-xl md:text-2xl font-bold">Import Spreadsheet Data</h1>
                <p className="text-sm text-muted">Upload or link a spreadsheet to import student grades</p>
            </div>
            
            {/* Error display */}
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{error.title}</AlertTitle>
                    <AlertDescription>
                        {error.message}
                        {error.details && (
                            <div className="mt-2 text-xs">
                                <details>
                                    <summary>Technical Details</summary>
                                    <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">
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
                <Alert className="mb-4 bg-gray-100">
                    <AlertTitle>Debug Information</AlertTitle>
                    <AlertDescription>
                        <details>
                            <summary>Request Details</summary>
                            <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </details>
                    </AlertDescription>
                </Alert>
            )}
            
            <div>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="upload"
                            className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
                            >
                            Upload Spreadsheet
                        </TabsTrigger>
                        <TabsTrigger
                            value="link"
                            className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
                            >
                            Link Spreadsheet
                        </TabsTrigger>
                    </TabsList>


                    <TabsContent value="upload" className="mt-4">
                        <div className="flex flex-col items-center justify-center bg-gray-300/40 rounded-sm p-4 h-full transition-all duration-300 ease-in-out hover:bg-gray-300/50">
                            <FolderOpen className="w-8 h-8" />
                            <h2 className="text-xl font-bold">Upload Spreadsheet</h2>
                            <p className="text-base text-muted">Drag and drop your file here, or</p>
                            <Button 
                                variant={selectedFile ? "default" : "outline"} 
                                className="mt-2 cursor-pointer flex gap-2 items-center transition-all duration-300 hover:scale-105" 
                                onClick={handleButtonClick}
                                disabled={isUploading}
                            >
                                {selectedFile ? (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        <span className="text-sm">{isUploading ? "Uploading..." : "Upload"}</span>
                                    </>
                                ) : (
                                    <span className="text-sm">Browse</span>
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
                                <div className="text-sm mt-2 p-2 bg-gray-100 rounded flex items-center transition-all duration-300 animate-in fade-in">
                                    <span className="mr-2">📄</span>
                                    {selectedFile.name}
                                </div>
                            )}
                            <p className="text-sm text-muted mt-2">Supported formats: .xlsx, .csv</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="link" className="mt-4">
                        <div className="flex flex-col items-center justify-center bg-gray-300/40 rounded-sm p-4 h-full transition-all duration-300 ease-in-out hover:bg-gray-300/50">
                            <LinkIcon className="w-8 h-8" />
                            <h2 className="text-xl font-bold">Link Spreadsheet</h2>
                            <p className="text-base text-muted">Enter the URL of your Google Sheets document</p>
                            
                            <div className="w-full max-w-md mt-4">
                                <Input
                                    type="url"
                                    placeholder="https://docs.google.com/spreadsheets/d/..."
                                    className="w-full mb-2"
                                    value={sheetUrl}
                                    onChange={handleUrlChange}
                                />
                                <Button 
                                    variant="default" 
                                    className="w-full flex gap-2 items-center justify-center transition-all duration-300 hover:scale-105" 
                                    onClick={handleUrlSubmit}
                                    disabled={isProcessingUrl || !sheetUrl}
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    <span className="text-sm">{isProcessingUrl ? "Processing..." : "Import Spreadsheet"}</span>
                                </Button>
                            </div>
                            
                            <div className="text-sm text-muted mt-4">
                                <p>Supported services:</p>
                                <ul className="list-disc list-inside">
                                    <li>Google Sheets</li>
                                </ul>
                                <p className="mt-2">Make sure your spreadsheet is <strong>shared</strong> with view access.</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    )
}