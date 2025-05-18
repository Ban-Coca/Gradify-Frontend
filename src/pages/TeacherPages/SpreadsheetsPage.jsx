import Layout from "@/components/layout"
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, Upload } from 'lucide-react';
import React, { useState } from "react";
import { useAuth } from "@/contexts/authentication-context";
import { uploadSpreadsheet } from "@/services/teacher/spreadsheetservices";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import toast from 'react-hot-toast';

export default function SpreadsheetsPage() {
    const { currentUser, getAuthHeader } = useAuth();
    const fileInputRef = React.useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(currentUser.userId)
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

    return (
        <Layout>
            {/* Toast container */}
            <Toaster />
            
            <div className='bg-inherited p-4 rounded-lg mt-4 mb-4'>
                <h1 className="text-xl md:text-2xl font-bold">Import Spreadsheet Data</h1>
                <p className="text-sm text-muted">Upload or link a spreadsheet to import student grades</p>
            </div>
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
                        <div className="flex flex-col items-center justify-center bg-gray-300/40 rounded-sm p-4 h-full">
                            <h2 className="text-2xl font-bold">Link Spreadsheet</h2>
                            <p className="text-lg text-muted">Enter the URL of the spreadsheet</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    )
}