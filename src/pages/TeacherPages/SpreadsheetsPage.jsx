import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderOpen,
  Upload,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@/contexts/authentication-context";
// Import the new service method
import {
  uploadSpreadsheet,
  processSpreadsheetUrl,
  checkIfSpreadsheetExists,
} from "@/services/teacher/spreadsheetservices";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; // Assuming sonner is used for toasts elsewhere
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GraphFileBrowser from "@/components/graph-file-browser";
import { GoogleDrivePicker } from "@/components/google-drive-picker";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { api } from "@/config/api";
import { API_ENDPOINTS } from "@/config/constants";
import ExcelFormatGuide from "@/components/excel-format-guide";

export default function SpreadsheetsPage() {
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { currentUser, getAuthHeader } = useAuth();
  const fileInputRef = React.useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [isProcessingUrl, setIsProcessingUrl] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const hintShown = localStorage.getItem('formatGuideHintShown');
    if (!hintShown) {
      setShowHint(true);
    }
  }, []);

  const helmet = useDocumentTitle("Spreadsheets", "Import and manage spreadsheet data for your classes.");

  const isValidSpreadsheetUrl = (url) => {
    if (!url) return false;
    const googleSheetsPatterns = [
      /docs\.google\.com\/spreadsheets/,
      /sheets\.google\.com/,
    ];
    const allPatterns = [...googleSheetsPatterns];
    return allPatterns.some((pattern) => pattern.test(url));
  };

  const getUrlProvider = (url) => {
    if (!url) return "Unknown";
    if (url.includes("docs.google.com") || url.includes("sheets.google.com"))
      return "Google Sheets";
    return "Unknown";
  };

  // Custom toast helper functions
  const showSuccessToast = (message, options = {}) => {
    toast(
      () => (
        <div className="flex items-center gap-3 p-1">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
        </div>
      ),
      {
        duration: options.duration || 4000,
        position: options.position || "bottom-center",
        style: {
          background: "white",
          border: "1px solid #f3f4f6",
          borderLeft: "3px solid #10b981",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "16px",
          padding: "8px",
          minWidth: "320px",
          maxWidth: "450px",
        },
      }
    );
  };

  const showErrorToast = (message, options = {}) => {
    toast(
      () => (
        <div className="flex items-center gap-3 p-1">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 mb-1">Error</p>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      ),
      {
        duration: options.duration || 5000,
        position: options.position || "bottom-center",
        style: {
          background: "white",
          border: "1px solid #f3f4f6",
          borderLeft: "3px solid #ef4444",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "16px",
          padding: "8px",
          minWidth: "320px",
          maxWidth: "450px",
        },
      }
    );
  };

  // Helper functions for URL submission
  const validateUrl = (sheetUrl, showErrorToast, isValidSpreadsheetUrl) => {
    if (!sheetUrl) {
      showErrorToast("Please enter a spreadsheet URL");
      return false;
    }
    if (!isValidSpreadsheetUrl(sheetUrl)) {
      showErrorToast(
        "Please provide a valid Google Sheets or Microsoft Excel Online URL.",
        { duration: 5000 }
      );
      return false;
    }
    return true;
  };

  const checkUrlSupport = async (sheetUrl, getAuthHeader, api, API_ENDPOINTS) => {
    const checkResponse = await api.get(`${API_ENDPOINTS.SPREADSHEET.CHECK_URL_SUPPORT}?url=${sheetUrl}`, {
      headers: getAuthHeader()
    });
    return checkResponse.data;
  };

  const processUrl = async (sheetUrl, teacherId, getAuthHeader, processSpreadsheetUrl) => {
    return await processSpreadsheetUrl(
      { url: sheetUrl, teacherId },
      getAuthHeader()
    );
  };

  const handleUrlSuccess = (response, sheetUrl, navigate, showSuccessToast, setSheetUrl, getUrlProvider, showErrorToast) => {
    let spreadsheetId;
    if (response.spreadsheet && response.spreadsheet.id) {
      spreadsheetId = response.spreadsheet.id;
    } else {
      console.error("Could not find spreadsheet ID in response:", response);
      showErrorToast("Processing successful but couldn't retrieve spreadsheet ID.");
      return false;
    }

    showSuccessToast(
      `Spreadsheet from ${response.provider || getUrlProvider(sheetUrl)} processed successfully!`,
      { duration: 3000, position: "bottom-center" }
    );

    navigate(`/teacher/spreadsheets/display/${spreadsheetId}`, {
      state: { fromLinkImport: true },
    });

    setSheetUrl("");
    return true;
  };

  const handleFileChange = async (event) => {
    // Make async
    const file = event.target.files[0];
    if (file) {
      setError(null);
      setDebugInfo(null); // Clear previous debug info

      // --- DUPLICATE CHECK ---
      try {
        setIsUploading(true); // Show a generic loading state
        const toastId = toast.loading("Checking file...", {
          position: "bottom-center",
        });
        const exists = await checkIfSpreadsheetExists(
          file.name,
          currentUser.userId,
          getAuthHeader()
        );
        toast.dismiss(toastId);

        if (exists) {
          toast(
            (t) => (
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
                      A file named{" "}
                      <span className="font-medium text-gray-800">
                        "{file.name}"
                      </span>{" "}
                      already exists. Would you like to replace it?
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
                      showSuccessToast(
                        `Ready to replace "${file.name}". Click "Upload File" to proceed.`
                      );
                    }}
                  >
                    Replace File
                  </Button>
                </div>
              </div>
            ),
            {
              duration: Infinity,
              position: "bottom-center",
              style: {
                background: "white",
                border: "1px solid #f3f4f6",
                borderLeft: "3px solid #f59e0b",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                borderRadius: "16px",
                padding: "8px",
                minWidth: "400px",
                maxWidth: "600px",
              },
            }
          );
          setIsUploading(false);
          return;
        }
        // If file does not exist, proceed to select it
        setSelectedFile(file);
        showSuccessToast(`File "${file.name}" selected. Ready to upload.`, {
          duration: 3000,
        });
      } catch (checkError) {
        toast.dismiss(); // Dismiss any loading toast
        console.error("Error checking if file exists:", checkError);
        setError({
          title: "File Check Failed",
          message:
            "Could not verify if the file already exists. Please try again or proceed with caution.",
          details: checkError.message,
        });
        showErrorToast(
          "Could not verify if file exists. Proceed with caution."
        );
        // Optionally allow upload anyway or block it
        // setSelectedFile(file); // Or keep it null to block
      } finally {
        setIsUploading(false);
      }
      // --- END DUPLICATE CHECK ---
    }
  };

  const handleButtonClick = async () => {
    if (selectedFile) {
      setIsUploading(true);
      setError(null);
      setDebugInfo(null);

      const loadingToast = toast.loading("Uploading spreadsheet...", {
        position: "bottom-center",
      });

      try {
        const response = await uploadSpreadsheet(
          { file: selectedFile, teacherId: currentUser.userId },
          getAuthHeader()
        );

        let spreadsheetId;
        if (response.id) {
          // Direct ID in response
          spreadsheetId = response.id;
        } else if (response.spreadsheet && response.spreadsheet.id) {
          // ID nested under 'spreadsheet'
          spreadsheetId = response.spreadsheet.id;
        } else {
          console.error("Could not find spreadsheet ID in response:", response);
          showErrorToast(
            "Upload successful but couldn't retrieve spreadsheet ID."
          );
          setIsUploading(false);
          setSelectedFile(null);
          toast.dismiss(loadingToast);
          return;
        }

        toast.dismiss(loadingToast);
        showSuccessToast("Spreadsheet uploaded successfully!", {
          position: "bottom-center",
          duration: 3000,
        });

        navigate(`/teacher/spreadsheets/display/${spreadsheetId}`, {
          state: { fromUpload: true },
        });

        setSelectedFile(null); // Clear selected file after successful upload
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.dismiss(loadingToast);
        setError({
          title: error.response?.data?.errorCode || "Upload Failed",
          message: error.response?.data?.message || error.message || "Unknown error occurred while uploading the file.",
          details: error.response?.data || error.response?.statusText,
        });
        
        showErrorToast(
          `Error uploading file: ${error.response?.data?.message || error.message || "Unknown error"}`,
          { duration: 5000 }
        );
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
    if (!validateUrl(sheetUrl, showErrorToast, isValidSpreadsheetUrl)) return;

    setIsProcessingUrl(true);
    setError(null);
    setDebugInfo(null);

    const loadingToast = toast.loading("Processing spreadsheet URL...", {
      position: "bottom-center",
    });

    try {
      const checkResult = await checkUrlSupport(sheetUrl, getAuthHeader, api, API_ENDPOINTS);

      setDebugInfo({
        urlCheck: checkResult,
        detectedProvider: getUrlProvider(sheetUrl),
        isUrlValid: isValidSpreadsheetUrl(sheetUrl),
      });

      if (!checkResult.supported) {
        toast.dismiss(loadingToast);
        showErrorToast(
          `Unsupported spreadsheet URL. Provider: ${checkResult.provider || "Unknown"}. Please use a valid Google Sheets or Microsoft Excel Online URL.`,
          { duration: 7000 }
        );
        setIsProcessingUrl(false);
        return;
      }

      const response = await processUrl(sheetUrl, currentUser.userId, getAuthHeader, processSpreadsheetUrl);

      toast.dismiss(loadingToast);

      if (!handleUrlSuccess(response, sheetUrl, navigate, showSuccessToast, setSheetUrl, getUrlProvider, showErrorToast)) {
        setIsProcessingUrl(false);
        return;
      }

    } catch (error) {
      console.error("Error processing spreadsheet URL:", error);
      toast.dismiss(loadingToast);
      
      let parsedErrorData = null;
      const errorMessage = error.message || "";
      const jsonMatch = errorMessage.match(/\{.*\}/);
      if (jsonMatch) {
        try {
          parsedErrorData = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.warn("Failed to parse JSON from error message:", parseError);
        }
      }
      
      setError({
        title: parsedErrorData?.errorCode || "Error",
        message: parsedErrorData?.message || errorMessage || "Unknown error occurred.",
        details: parsedErrorData || error.response?.statusText,
      });
      const displayErrorMessage = parsedErrorData?.message || errorMessage || "Unknown error";
      showErrorToast(`Error processing URL: ${displayErrorMessage}`, { duration: 5000 });
    } finally {
      setIsProcessingUrl(false);
    }
  };

  const handleUrlChange = (event) => {
    setSheetUrl(event.target.value);
  };

  return (
    <Layout>
      {helmet}
      <Toaster richColors />

      <div className="bg-neutral-50 dark:bg-card p-6 rounded-lg border dark:border-emerald-900 mt-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-200">
              Import Spreadsheet Data
            </h1>
            <p className="text-neutral-600 dark:text-neutral-200 mt-2">
              Upload or link a spreadsheet to import student grades
            </p>
          </div>

          {/* Button on the right */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => {
                setShowFormatGuide(true);
                setShowHint(false);
                localStorage.setItem('formatGuideHintShown', 'true');
              }}
              className="
                border-green-700 text-green-700
                dark:border-green-400 dark:text-green-300
                hover:bg-green-700 hover:text-white
                dark:hover:bg-green-400 dark:hover:text-neutral-900
                transition-all duration-200 ease-in-out
                hover:shadow-md hover:scale-[1.02]
              "
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              View Required Excel Format
            </Button>
            
            {/* Chat bubble hint */}
            {showHint && (
            <div className="absolute -right-2 -top-5 animate-bounce">
              <div className="relative bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
                Check this first!
                {/* Tail of the chat bubble */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-green-500"></div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      <ExcelFormatGuide 
      isOpen={showFormatGuide}
      onClose={() => setShowFormatGuide(false)}
    />

      {error && (
        <Alert className="border-red-200 bg-red-50 mb-6 relative">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100"
            onClick={() => setError(null)}
          >
            <X className="h-3 w-3 text-red-600" />
          </Button>
          <AlertDescription className="text-red-800 pr-8">
            {(() => {
              const errorData = error?.details;

              // Check if it's a detailed error with specific information (like grade validation)
              if (
                errorData?.errorCode === "GRADE_VALIDATION_ERROR" &&
                errorData?.details?.errors
              ) {
                return (
                  <div className="space-y-2">
                    <div className="font-semibold">
                      {errorData.message ||
                        error.title ||
                        "Grade validation failed"}
                    </div>
                    <div className="text-sm">
                      Error Code: {errorData.errorCode}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                      {errorData.details.errors.map(
                        (validationError, index) => (
                          <div
                            key={index}
                            className="text-sm bg-red-100 p-2 rounded border-l-4 border-red-400"
                          >
                            <div className="font-medium">
                              Row {validationError.row}:{" "}
                              {validationError.studentNumber}
                            </div>
                            <div>{validationError.message}</div>
                            <div className="text-xs text-red-600 mt-1">
                              Assessment: {validationError.assessmentName} |
                              Value: {validationError.actualValue} | Max:{" "}
                              {validationError.maxValue}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    {errorData.details.errorCount > 1 && (
                      <div className="text-sm font-medium mt-2">
                        Total errors: {errorData.details.errorCount}
                      </div>
                    )}
                  </div>
                );
              }

              // Check for other structured errors with error arrays
              if (
                errorData &&
                typeof errorData === "object" &&
                errorData.errors &&
                Array.isArray(errorData.errors)
              ) {
                return (
                  <div className="space-y-2">
                    <div className="font-semibold">
                      {error.title || "Multiple errors occurred"}
                    </div>
                    <div className="text-sm">
                      {error.message || "Please review the following issues:"}
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-3">
                      {errorData.errors.map((detailError, index) => (
                        <div
                          key={index}
                          className="text-sm bg-red-100 p-2 rounded border-l-4 border-red-400"
                        >
                          {detailError.message || detailError}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // Fallback to simple error display with optional technical details
              return (
                <div className="space-y-2">
                  <div className="font-semibold">
                    {error.title || "An error occurred"}
                  </div>
                  <div className="text-sm">
                    {error.message || "Unknown error occurred"}
                  </div>
                  {errorData && (
                    <div className="mt-2 text-xs">
                      <details>
                        <summary className="cursor-pointer hover:text-red-600 font-medium">
                          Technical Details
                        </summary>
                        <div className="mt-2 bg-red-100 p-3 rounded border-l-4 border-red-400">
                          <pre className="whitespace-pre-wrap text-xs max-h-32 overflow-auto">
                            {typeof errorData === "object"
                              ? JSON.stringify(errorData, null, 2)
                              : String(errorData)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              );
            })()}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-card rounded-lg border shadow-sm">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-900">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-600 hover:text-green-600 transition-colors duration-200"
            >
              Upload Spreadsheet
            </TabsTrigger>
            <TabsTrigger
              value="google-link"
              className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-600 hover:text-green-600 transition-colors duration-200"
            >
              Link Google Spreadsheet
            </TabsTrigger>

            <TabsTrigger
              value="microsoft-excel"
              className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm text-neutral-600 hover:text-green-600 transition-colors duration-200"
            >
              Microsoft Excel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="p-6">
            <div className="flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 rounded-lg p-8 border-2 border-dashed border-neutral-300 hover:border-neutral-400 transition-colors">
              <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Upload Spreadsheet
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Drag and drop your file here, or click to browse
              </p>
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
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">
                    {selectedFile.name}
                  </span>
                </div>
              )}
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </div>
          </TabsContent>

          <TabsContent value="google-link" className="p-6">
            <div className="flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 rounded-lg p-8 border-2 border-dashed border-neutral-300">
              <LinkIcon className="w-12 h-12 text-neutral-400 mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Link Spreadsheet
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Enter the URL of your spreadsheet document
              </p>

              <div className="w-full max-w-md space-y-4">
                <Input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/..."
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

                {/* <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex justify-center">
                  <GoogleDrivePicker userEmail={currentUser.email} />
                </div> */}
              </div>

              <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 space-y-2">
                <p className="mt-2 text-xs">
                  <strong>Note:</strong> Make sure your spreadsheet is shared
                  with view access.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="microsoft-excel" className="p-6">
            <div
              className={`flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 rounded-lg p-8 border-2 border-dashed border-neutral-300 ${
                currentUser?.provider !== "Microsoft"
                  ? "opacity-50"
                  : "hover:border-neutral-400"
              } transition-colors`}
            >
              <FolderOpen className="w-12 h-12 text-neutral-400 mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Microsoft Excel
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                {currentUser?.provider !== "Microsoft"
                  ? "Microsoft Excel integration is only available for Microsoft accounts"
                  : "Browse your OneDrive file from here"}
              </p>
              <Button
                className="w-fit transition-all duration-300"
                onClick={() => setModalOpen(true)}
                disabled={currentUser?.provider !== "Microsoft"}
              >
                Browse Drive Files
              </Button>
              {currentUser?.provider !== "Microsoft" && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Please sign in with a Microsoft account to use this feature
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <GraphFileBrowser
        open={isModalOpen}
        openChange={setModalOpen}
        userId={currentUser?.userId}
      />
    </Layout>
  );
}
