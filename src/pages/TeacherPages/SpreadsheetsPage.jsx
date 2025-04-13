import Layout from "@/components/layout"
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen } from 'lucide-react';
import React from "react";
export default function SpreadsheetsPage() {
    const fileInputRef = React.useRef(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Handle the file upload here
            console.log("Selected file:", file);
        }
    }
    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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
                        <TabsTrigger value="upload" className="w-full text-center transition-all duration-300 transform">
                            Upload Spreadsheet
                        </TabsTrigger>
                        <TabsTrigger value="link" className="w-full text-center transition-all duration-300 transform">
                            Link Spreadsheet
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-4">
                        <div className="flex flex-col items-center justify-center bg-gray-300/40 rounded-sm p-4 h-full">
                            <FolderOpen className="w-8 h-8" />
                            <h2 className="text-2xl font-bold">Upload Spreadsheet</h2>
                            <p className="text-base text-muted">Drag and drop your file here, or</p>
                            <Button variant="outline" className="mt-2 cursor-pointer" onClick={handleBrowseClick}>
                                <span className="text-sm">Browse</span>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept=".xlsx, .csv" 
                                    className="hidden"
                                    onChange={handleFileChange} />
                            </Button>
                            <p className="text-sm text-muted mt-2">Supported formats: .xlsx, .csv</p>
                            
                        </div>
                    </TabsContent>
                    <TabsContent value="link" className="mt-4">
                        <div className="flex flex-col items-center justify-center bg-gray-300/40 rounded-sm p-4 h-full">
                            <h2 className="text-2xl font-bold">Link Spreadsheet</h2>
                            <p className="text-lg text-muted">Enter the URL of the spreadsheet</p>
                            {/* Add your link component here */}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    )
}