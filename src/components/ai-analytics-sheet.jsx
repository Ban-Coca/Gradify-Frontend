import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain } from "lucide-react";
import { getClassAnalytics } from "@/services/teacher/teacherService";
import { useAuth } from "@/contexts/authentication-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
export default function AiAnalyticsSheet({ classId }) {
  const { getAuthHeader } = useAuth();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [currentClassId, setCurrentClassId] = useState(classId);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentClassId !== classId) {
      setShouldFetch(false);
      setCurrentClassId(classId);
    }
  }, [classId, currentClassId]);

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["classAnalytics"],
    queryFn: async () => {
      const htmlData = await getClassAnalytics(classId, getAuthHeader());

      // Sanitize the HTML content
      const cleanHTML = DOMPurify.sanitize(htmlData, {
        ALLOWED_TAGS: [
          "div",
          "p",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "strong",
          "em",
          "table",
          "tr",
          "td",
          "th",
          "thead",
          "tbody",
        ],
        ALLOWED_ATTR: ["class", "style"],
        KEEP_CONTENT: true,
      });

      return cleanHTML;
    },
    enabled: !!classId && shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (shouldFetch) {
      queryClient.removeQueries(["classAnalytics", classId]);
      refetch();
    }
  }, [classId, shouldFetch, queryClient, refetch]);

  const handleGenerateAnalytics = () => {
    setShouldFetch(true);
  };
  const showData = analyticsData && currentClassId === classId;
  const showLoading =
    isAnalyticsLoading || (shouldFetch && currentClassId !== classId);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={handleGenerateAnalytics}
          disabled={isAnalyticsLoading}
        >
          <Brain className="w-4 h-4 mr-2" />
          {showLoading ? "Generating..." : "AI Analytics"}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:max-w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI-Driven Class Analytics
          </SheetTitle>
          <SheetDescription>
            Comprehensive performance analysis and actionable insights for IT342
            (Section G3)
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {showLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Brain className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
                <p className="text-lg font-medium">
                  Analyzing class performance...
                </p>
                <p className="text-gray-600">This may take a few moments</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-2">Failed to generate analytics</p>
              <Button
                onClick={handleGenerateAnalytics}
                variant="outline"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          ) : analyticsData ? (
            <div
              className="max-w-none"
              dangerouslySetInnerHTML={{ __html: analyticsData }}
            />
          ) : (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Click "AI Analytics" to generate comprehensive insights
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
