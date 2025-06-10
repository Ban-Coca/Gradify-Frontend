import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, Upload, Link as LinkIcon, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import React, { useState, useCallback } from "react"; // Imported useCallback
import { useAuth } from "@/contexts/authentication-context";
import { uploadSpreadsheet, processSpreadsheetUrl, checkIfSpreadsheetExists } from "@/services/teacher/spreadsheetservices";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils"; // Import the cn utility


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

    // --- START: Added for Drag-and-Drop ---
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((event) => {
        event.preventDefault(); // This is necessary to allow for a drop
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false);
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileChange({ target: { files } });
        }
    }, []);
    // --- END: Added for Drag-and-Drop ---

    const isValidSpreadsheetUrl = (url) => {
        if (!url) return false;
        const googleSheetsPatterns = [/docs\.google\.com\/spreadsheets/, /sheets\.google\.com/];
        const microsoftExcelPatterns = [/onedrive\.live\.com/, /1drv\.ms/, /sharepoint\.com/, /office\.com\/x\//, /excel\.office\.com/];
        const allPatterns = [...googleSheetsPatterns, ...microsoftExcelPatterns];
        return allPatterns.some(pattern => pattern.test(url));
    };

    const getUrlProvider = (url) => {
        if (!url) return 'Unknown';
        if (url.includes('docs.google.com') || url.includes('sheets.google.com')) return 'Google Sheets';
        if (url.includes('onedrive.live.com') || url.includes('1drv.ms') || url.includes('sharepoint.com') || url.includes('office.com') || url.includes('excel.office.com')) return 'Microsoft Excel';
        return 'Unknown';
    };

    // Custom toast helper functions
    const showSuccessToast = (message, options = {}) => {
        toast(() => (
            <div className="flex items-center gap-3 p-1">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                        {message}
                    </p>
                </div>
            </div>
        ), {
            duration: options.duration || 4000,
            position: options.position || 'bottom-center',
            style: {
                background: 'white',
                border: '1px solid #f3f4f6',
                borderLeft: '3px solid #10b981',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                padding: '8px',
                minWidth: '320px',
                maxWidth: '450px'
            }
        });
    };

    const showErrorToast = (message, options = {}) => {
        toast(() => (
            <div className="flex items-center gap-3 p-1">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        Error
                    </p>
                    <p className="text-sm text-gray-600">
                        {message}
                    </p>
                </div>
            </div>
        ), {
            duration: options.duration || 5000,
            position: options.position || 'bottom-center',
            style: {
                background: 'white',
                border: '1px solid #f3f4f6',
                borderLeft: '3px solid #ef4444',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                padding: '8px',
                minWidth: '320px',
                maxWidth: '450px'
            }
        });
    };


    const handleFileChange = async (event) => { // Make async
        const file = event.target.files[0];
        if (file) {
            setError(null);
            setDebugInfo(null); // Clear previous debug info

            // --- DUPLICATE CHECK ---
            try {
                setIsUploading(true); // Show a generic loading state
                const toastId = toast.loading("Checking file...", { position: 'bottom-center' });
                const exists = await checkIfSpreadsheetExists(file.name, currentUser.userId, getAuthHeader());
                toast.dismiss(toastId);

               if (exists) {
    toast((t) => (
        <div className="flex flex-col gap-3 p-1">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        File already exists
                    </p>
                    <p className="text-sm text-gray-600">
                        A file named <span className="font-medium text-gray-800">"{file.name}"</span> already exists. 
                        Would you like to replace it?
                    </p>
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    onClick={() => {
                        toast.dismiss(t.id);
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                    onClick={() => {
                        toast.dismiss(t.id);
                        setSelectedFile(file);
                        showSuccessToast(`Ready to replace "${file.name}". Click "Upload File" to proceed.`);
                    }}
                >
                    Replace File
                </Button>
            </div>
        </div>
    ), { 
        duration: Infinity, 
        position: 'bottom-center',
        style: {
            background: 'white',
            border: '1px solid #f3f4f6',
            borderLeft: '3px solid #f59e0b',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            padding: '8px',
            minWidth: '400px',
            maxWidth: '600px'
        }
    });
    setIsUploading(false);
    return;
}
                // If file does not exist, proceed to select it
                setSelectedFile(file);
                showSuccessToast(`File "${file.name}" selected. Ready to upload.`, { duration: 3000 });

            } catch (checkError) {
                toast.dismiss(); // Dismiss any loading toast
                console.error("Error checking if file exists:", checkError);
                setError({
                    title: "File Check Failed",
                    message: "Could not verify if the file already exists. Please try again or proceed with caution.",
                    details: checkError.message
                });
                showErrorToast("Could not verify if file exists. Proceed with caution.");
                // Optionally allow upload anyway or block it
                // setSelectedFile(file); // Or keep it null to block
            } finally {
                setIsUploading(false);
            }
            // --- END DUPLICATE CHECK ---
        }
    };
    
    const handleButtonClick = async () => {
        if(selectedFile){
            setIsUploading(true);
            setError(null);
            setDebugInfo(null);
            
            const loadingToast = toast.loading('Uploading spreadsheet...', { position: 'bottom-center' });
            
            try {
                const response = await uploadSpreadsheet(
                    {file: selectedFile, teacherId: currentUser.userId},
                    getAuthHeader()
                );
                
                let spreadsheetId;
                if (response.id) { // Direct ID in response
                    spreadsheetId = response.id;
                } else if (response.spreadsheet && response.spreadsheet.id) { // ID nested under 'spreadsheet'
                    spreadsheetId = response.spreadsheet.id;
                } else {
                    console.error("Could not find spreadsheet ID in response:", response);
                    showErrorToast("Upload successful but couldn't retrieve spreadsheet ID.");
                    setIsUploading(false);
                    setSelectedFile(null);
                    toast.dismiss(loadingToast);
                    return;
                }
                
                toast.dismiss(loadingToast);
                showSuccessToast('Spreadsheet uploaded successfully!', { position: 'bottom-center', duration: 3000 });
                
                navigate(`/teacher/spreadsheets/display/${spreadsheetId}`, { state: { fromUpload: true } });
                
                setSelectedFile(null); // Clear selected file after successful upload
            } catch (error) {
                console.error("Error uploading file:", error);
                toast.dismiss(loadingToast);
                setError({
                    title: "Upload Failed",
                    message: error.message || "Unknown error occurred while uploading the file.",
                    details: error.response?.data || error.response?.statusText
                });
                showErrorToast(`Error uploading file: ${error.message || "Unknown error"}`, { duration: 5000 });
            } finally {
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
            showErrorToast("Please enter a spreadsheet URL");
            return;
        }

        if (!isValidSpreadsheetUrl(sheetUrl)) {
            showErrorToast("Please provide a valid Google Sheets or Microsoft Excel Online URL.", { duration: 5000 });
            return;
        }

        setIsProcessingUrl(true);
        setError(null);
        setDebugInfo(null);
        
        const loadingToast = toast.loading('Processing spreadsheet URL...', { position: 'bottom-center' });

        try {
            const API_BASE_URL_CHECK = import.meta.env.VITE_API_BASE_URL_TEACHER_SERVICE; // Assuming same base URL for check
            const checkResponse = await axios.get(`${API_BASE_URL_CHECK}/check-url-support`, {
                params: { url: sheetUrl },
                headers: getAuthHeader()
            });
            
            const checkResult = checkResponse.data;
            
            setDebugInfo({ // Store debug info earlier
                urlCheck: checkResult,
                detectedProvider: getUrlProvider(sheetUrl),
                isUrlValid: isValidSpreadsheetUrl(sheetUrl),
            });

            if (!checkResult.supported) {
                toast.dismiss(loadingToast);
                showErrorToast(`Unsupported spreadsheet URL. Provider: ${checkResult.provider || 'Unknown'}. Please use a valid Google Sheets or Microsoft Excel Online URL.`, {
                    duration: 7000
                });
                setIsProcessingUrl(false);
                return;
            }
            
            const response = await processSpreadsheetUrl(
                { url: sheetUrl, teacherId: currentUser.userId },
                getAuthHeader()
            );
            
            let spreadsheetId;
            if (response.spreadsheet && response.spreadsheet.id) {
                spreadsheetId = response.spreadsheet.id;
            } else {
                console.error("Could not find spreadsheet ID in response:", response);
                showErrorToast("Processing successful but couldn't retrieve spreadsheet ID.");
                setIsProcessingUrl(false);
                toast.dismiss(loadingToast);
                return;
            }
            
            toast.dismiss(loadingToast);
            showSuccessToast(`Spreadsheet from ${response.provider || getUrlProvider(sheetUrl)} processed successfully!`, { 
                duration: 3000, 
                position: 'bottom-center' 
            });
            
            navigate(`/teacher/spreadsheets/display/${spreadsheetId}`, { state: { fromLinkImport: true } });
            
            setSheetUrl("");
        } catch (error) {
            console.error("Error processing spreadsheet URL:", error);
            toast.dismiss(loadingToast);
            setError({
                title: "URL Processing Failed",
                message: error.message || "Unknown error occurred.",
                details: error.response?.data || error.response?.statusText
            });
            const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Unknown error";
            showErrorToast(`Error processing URL: ${errorMessage}`, { duration: 5000 });
        } finally {
            setIsProcessingUrl(false);
        }
    };

    const handleUrlChange = (event) => {
        setSheetUrl(event.target.value);
    };

    return (
        <Layout>
            <Toaster richColors />
            
            <div className='bg-gray-50 p-6 rounded-lg border mt-4 mb-4'>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Import Spreadsheet Data</h1>
                <p className="text-gray-600 mt-2">Upload or link a spreadsheet to import student grades</p>
            </div>
            
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
                                    <pre className="mt-2 whitespace-pre-wrap bg-red-100 p-2 rounded text-xs border max-h-32 overflow-auto">
                                        {typeof error.details === 'object' 
                                            ? JSON.stringify(error.details, null, 2) 
                                            : String(error.details)}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </AlertDescription>
                </Alert>
            )}
            
            {import.meta.env.DEV && debugInfo && (
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                     <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-blue-800">Debug Information (Dev Mode)</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        <pre className="mt-2 whitespace-pre-wrap bg-blue-100 p-2 rounded text-xs border max-h-48 overflow-auto">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </AlertDescription>
                </Alert>
            )}
            
            <div className="bg-white rounded-lg border shadow-sm">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                        <TabsTrigger 
                            value="upload" 
                            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                        >
                            Upload Spreadsheet
                        </TabsTrigger>
                        <TabsTrigger 
                            value="link" 
                            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                        >
                            Link Spreadsheet
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="p-6">
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={cn(
                                "flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors",
                                isDragOver && "border-primary bg-primary/10"
                            )}
                        >
                            <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {isDragOver ? "Drop File to Upload" : "Upload Spreadsheet"}
                            </h2>
                            <p className="text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
                            <Button 
                                variant={selectedFile ? "default" : "outline"} 
                                className="mb-4 transition-all duration-300 hover:scale-105" 
                                onClick={handleButtonClick}
                                disabled={isUploading}
                            >
                                {selectedFile && !isUploading ? (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload File
                                    </>
                                ) : isUploading ? (
                                    "Uploading..."
                                ) : (
                                    "Browse Files"
                                )}
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept=".xlsx, .xls, .csv" // Updated accept attribute
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
                            <p className="text-sm text-gray-500 mt-2">Supported formats: .xlsx, .xls, .csv</p>
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