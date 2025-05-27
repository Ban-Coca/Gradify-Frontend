import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  title = "Upload Excel File",
  description = "Upload your Excel file to import data",
  isLoading = false,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const acceptedExtensions = [".xls", ".xlsx"];

  const validateFile = (file) => {
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!acceptedExtensions.includes(fileExtension)) {
      setError(
        `Invalid file type. Please upload an Excel file (${acceptedExtensions.join(
          ", "
        )})`
      );
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size too large. Please upload a file smaller than 10MB");
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback((files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);

    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadStatus("idle");
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setUploadProgress(0);
    setError(null);

    try {
      setUploadStatus("success");
      onUploadComplete?.(selectedFile);

      // Clear the modal after a short delay
      setTimeout(() => {
        resetModal();
      }, 2000);
    } catch (err) {
      setUploadStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);
    setIsDragOver(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-50 rounded-lg">
            <svg
              className="animate-spin h-6 w-6 text-primary mb-2"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-primary font-medium">Uploading...</span>
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>

          {/* Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-colors",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              (uploadStatus === "uploading" || isLoading) &&
                "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedExtensions.join(",")}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadStatus === "uploading" || isLoading}
            />

            <div className="flex flex-col items-center justify-center text-center">
              <Upload
                className={cn(
                  "h-10 w-10 mb-4",
                  isDragOver ? "text-primary" : "text-muted-foreground"
                )}
              />
              <p className="text-sm font-medium mb-1">
                {isDragOver
                  ? "Drop your Excel file here"
                  : "Drag & drop your Excel file here"}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                or click to browse (.xls, .xlsx files only)
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadStatus === "uploading" || isLoading}
              >
                Browse Files
              </Button>
            </div>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-primary/70 rounded-lg">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-white" />
                <div>
                  <p className="text-sm text-gray font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-white">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {uploadStatus === "idle" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Upload Progress */}
          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                File uploaded successfully! Your data is being processed.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {uploadStatus === "success" ? "Close" : "Cancel"}
            </Button>
            {selectedFile && uploadStatus === "idle" && (
              <Button onClick={handleUpload} disabled={isLoading}>
                Upload File
              </Button>
            )}
            {uploadStatus === "success" && (
              <Button
                onClick={() => {
                  resetModal();
                  onClose();
                }}
                disabled={isLoading}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
