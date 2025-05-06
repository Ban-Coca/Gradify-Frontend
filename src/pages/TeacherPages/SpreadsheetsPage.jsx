import Layout from "@/components/layout"
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, Upload } from 'lucide-react';
import React from "react";
import { useAuth } from "@/contexts/authentication-context";
import { uploadSpreadsheet } from "@/services/teacher/spreadsheetServices";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
export default function SpreadsheetsPage() {
    const { currentUser, getAuthHeader } = useAuth();
    const fileInputRef = React.useRef(null);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(currentUser.userId)
            setSelectedFile(file);
            console.log("Selected file:", file);
        }
    }
    const handleButtonClick = async () => {
        if(selectedFile){
            setIsUploading(true);
            try {
                console.log("Uploading file:", selectedFile);
                console.log("Teacher ID:", currentUser.userId);
                const response = await uploadSpreadsheet(
                    {file: selectedFile, teacherId: currentUser.userId},
                    getAuthHeader()
                );
                console.log("File uploaded successfully:", response);
                navigate(`/teacher/spreadsheets/display/${response.id}`);
                setIsUploading(false);
                setSelectedFile(null);
            } catch (error) {
                console.error("Error uploading file:", error);
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
            <div className=' bg-inherited p-4 rounded-lg mt-4 mb-4'>
                <h1 className="text-xl md:text-2xl font-bold">Import Spreadsheet Data</h1>
                <p className="text-sm text-muted">Upload or link a spreadsheet to import student grades</p>
            </div>
            <div>
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload" className="w-full text-center duration-300 text-white data-[state=active]:bg-white data-[state=active]:text-black">
                            Upload Spreadsheet
                        </TabsTrigger>
                        <TabsTrigger value="link" className="w-full text-center duration-300 text-white data-[state=active]:bg-white data-[state=active]:text-black">
                            Link Spreadsheet
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-4">
                        <div className="flex flex-col items-center justify-center bg-gray-300/40 rounded-sm p-4 h-full">
                            <FolderOpen className="w-8 h-8" />
                            <h2 className="text-xl font-bold">Upload Spreadsheet</h2>
                            <p className="text-base text-muted">Drag and drop your file here, or</p>
                            <Button 
                                variant={selectedFile ? "default" : "outline"} 
                                className="mt-2 cursor-pointer flex gap-2 items-center" 
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
                                <p className="text-sm mt-2">Selected: {selectedFile.name}</p>
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