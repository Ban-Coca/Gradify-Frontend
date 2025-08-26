import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getDriveRoot,
  getFolderFiles,
  saveExcelData,
} from "@/services/teacher/microsoftGraphService";
import { useAuth } from "@/contexts/authentication-context";
import {
  Folder,
  File,
  FileSpreadsheet,
  FileText,
  FileImage,
  Search,
  ArrowLeft,
  Download,
  Calendar,
  HardDrive,
  AlertCircle,
  X,
  Save,
} from "lucide-react";

export default function GraphFileBrowser({
  open,
  openChange,
  userId,
  onFileSelect,
}) {
  const { getAuthHeader } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const {
    data: rootFiles,
    isLoading: rootIsLoading,
    error: rootError,
  } = useQuery({
    queryKey: ["drive-files", userId, currentPath],
    queryFn: () => {
      return getDriveRoot(userId, getAuthHeader());
    },
    enabled: !!userId && open,
  });

  const {
    data: folderFiles,
    isLoading: folderIsLoading,
    error: folderError,
  } = useQuery({
    queryKey: ["folder-files", userId, currentPath],
    queryFn: () => {
      
      return getFolderFiles(userId, currentFolderId, getAuthHeader());
    },
    
    enabled: !!userId && !!currentFolderId && open,
  });

  const saveExcelMutation = useMutation({
    mutationFn: ({ folderName, fileName }) =>
      saveExcelData(userId, folderName, fileName, getAuthHeader()),
    onSuccess: (data) => {
      console.log("Excel data saved successfully");
    },
    onError: (error) => {
      console.log("Failed to save excel data", error);
    },
  });

  const files = currentPath.length === 0 ? rootFiles : folderFiles;
  const isLoading = currentPath.length === 0 ? rootIsLoading : folderIsLoading;
  const error = currentPath.length === 0 ? rootError : folderError;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (file) => {
    if (file.isFolder) {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case "doc":
      case "docx":
      case "txt":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredFiles =
    files?.filter((file) =>
      file?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleItemClick = (file) => {
    if (file.isFolder) {
      setCurrentPath([...currentPath, { name: file.name, id: file.id }]); // Store both name and id
      setCurrentFolderId(file.id); // Set the folder ID for the query
    } else {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleBreadcrumbClick = (index) => {
    const newPath = currentPath.slice(0, index);
    setCurrentPath(newPath);

    if (newPath.length === 0) {
      setCurrentFolderId(null); // Back to root
    } else {
      setCurrentFolderId(newPath[newPath.length - 1].id); // Set to the last folder's ID
    }
  };

  const handleGoBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      if (newPath.length === 0) {
        setCurrentFolderId(null); // Back to root
      } else {
        setCurrentFolderId(newPath[newPath.length - 1].id); // Set to parent folder's ID
      }
    }
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const handleSaveExcelData = () => {
    if (selectedFile && !selectedFile.isFolder) {
      const folderName =
        currentPath.length > 0
          ? currentPath[currentPath.length - 1].name
          : "root";

      saveExcelMutation.mutate({
        folderName,
        fileName: selectedFile.name,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            OneDrive File Browser
          </DialogTitle>
          <DialogDescription>
            Browse and select files from your OneDrive. Click on folders to
            navigate or files to select.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-1 min-h-0 ">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            {currentPath.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoBack}
                className="flex items-center gap-1 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Breadcrumb className="flex-1">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => {
                      setCurrentPath([]);
                      setCurrentFolderId(null);
                    }}
                    className="cursor-pointer"
                  >
                    Root
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {currentPath.map((folder, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {index === currentPath.length - 1 ? (
                        <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => handleBreadcrumbClick(index + 1)}
                          className="cursor-pointer"
                        >
                          {folder.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected file info */}
          {selectedFile && (
            <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile)}
                <span className="font-medium text-white">
                  {selectedFile.name}
                </span>
                <Badge variant="secondary">
                  {formatFileSize(selectedFile.size)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => window.open(selectedFile.webUrl, "_blank")}
                  className="flex items-center gap-1"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  Open
                </Button>
                {/* Save Excel Data Button */}
                <Button
                  size="sm"
                  onClick={handleSaveExcelData}
                  disabled={saveExcelMutation.isPending}
                  className="flex items-center gap-1"
                  variant="secondary"
                >
                  <Save className="h-4 w-4" />
                  {saveExcelMutation.isPending ? "Saving..." : "Save Data"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleRemoveFile}
                  className="flex items-center gap-1"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Save Excel Status */}
          {saveExcelMutation.isError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to save Excel data. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {saveExcelMutation.isSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Excel data saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto border rounded-lg">
            {error && (
              <Alert className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load files. Please try again.
                </AlertDescription>
              </Alert>
            )}
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="min-w-[300px]">Name</TableHead>
                      <TableHead className="w-32">Size</TableHead>
                      <TableHead className="w-56">Last Modified</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          {searchQuery
                            ? "No files match your search"
                            : "This folder is empty"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFiles.map((file, index) => {
                        if (!file) return null;
                        return (
                          <TableRow
                            key={file.id || index}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleItemClick(file)}
                          >
                            <TableCell>{getFileIcon(file)}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {file.name}
                                {file.isFolder && (
                                  <Badge variant="outline" className="text-xs">
                                    Folder
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {file.isFolder ? "—" : formatFileSize(file.size)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(file.lastModifiedDateTime)}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
