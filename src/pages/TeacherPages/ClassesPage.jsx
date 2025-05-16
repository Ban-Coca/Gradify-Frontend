  import { useNavigate, useParams } from "react-router-dom";
  import { useState, useEffect } from "react";
  import Layout from "@/components/layout";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent} from "@/components/ui/card"
  import { getClassByTeacherId } from "@/services/teacher/classServices";
  import ClassesList from "@/components/classes-list";
  import {Search, Plus, Filter} from "lucide-react";
  import { useAuth } from "@/contexts/authentication-context";
  import NewClass from "@/pages/TeacherPages/NewClass.jsx";

  const ClassesPage = () => {
    const { tab } = useParams(); // Read the `tab` parameter from the URL
    const navigate = useNavigate();
    const [view, setView] = useState("grid");
    const [classes, setClasses] = useState([]); // State for classes
    const [searchQuery, setSearchQuery] = useState("");
    const { currentUser, getAuthHeader } = useAuth();
    const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false); // State for modal visibility
    const [filteredClasses, setFilteredClasses] = useState([]);
    
    // Default to "current" if no tab is provided
    const defaultTab = tab || "current";
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
      const fetchClasses = async () => {
        try {
          const response = await getClassByTeacherId(currentUser.userId, getAuthHeader());
          console.log("Full API Response:", response);
    
          let allClasses = [];
          if (Array.isArray(response)) {
            allClasses = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            allClasses = response.data;
          } else {
            console.error("Unexpected API response:", response);
            setClasses([]); // Set an empty array if the response is invalid
            return;
          }
    
          // Determine the current semester and year
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1; // Months are 0-indexed, so add 1
          let currentSemester;
    
          if (currentMonth >= 1 && currentMonth <= 5) {
            currentSemester = "2nd Semester";
          } else if (currentMonth >= 8 && currentMonth <= 12) {
            currentSemester = "1st Semester";
          } else {
            currentSemester = null; // Outside semester range
          }
    
          // Categorize classes into current and past
          const categorizedClasses = allClasses.map((classItem) => {
            const { semester } = classItem; // Assuming classItem has `semester` and `year` fields
            let schoolYear = classItem.schoolYear;
            if (semester === currentSemester && schoolYear === currentYear.toString()) {
              return { ...classItem, category: "current" };
            } else if (parseInt(schoolYear) < currentYear || (schoolYear === currentYear.toString() && semester !== currentSemester)) {
              return { ...classItem, category: "past" };
            } else {
              return { ...classItem, category: "all" };
            }
          });
    
          setClasses(categorizedClasses); // Set the categorized classes
        } catch (err) {
          console.error("Error fetching classes:", err);
        }
      };
    
      fetchClasses();
    }, [currentUser.userId, getAuthHeader]);

    // Filter classes based on search query and active tab
    useEffect(() => {
      const filtered = classes.filter(classItem => {
        const matchesSearch = classItem.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            classItem.section.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTab = activeTab === "all" || classItem.category === activeTab;
        
        return matchesSearch && matchesTab;
      });
      
      setFilteredClasses(filtered);
    }, [classes, searchQuery, activeTab]);

    // Navigate to class detail page
    const navigateToClass = (classId) => {
      navigate(`/classes/classdetail/${classId}`);
    };

    // Navigate to a specific tab
    const navigateToTab = (tab) => {
      setActiveTab(tab);
      navigate(`/classes/${tab}`);
    };

    // Handle new class creation
    const handleClassCreated = (newClass) => {
      // Add category to the new class based on current date
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      let currentSemester;

      if (currentMonth >= 1 && currentMonth <= 5) {
        currentSemester = "2nd Semester";
      } else if (currentMonth >= 8 && currentMonth <= 12) {
        currentSemester = "1st Semester";
      } else {
        currentSemester = null;
      }

      let category = "all";
      if (newClass.semester === currentSemester && newClass.schoolYear === currentYear.toString()) {
        category = "current";
      } else if (parseInt(newClass.schoolYear) < currentYear || 
                (newClass.schoolYear === currentYear.toString() && newClass.semester !== currentSemester)) {
        category = "past";
      }

      const classWithCategory = { ...newClass, category };
      setClasses(prev => [...prev, classWithCategory]);
    };

    return (
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Your Classes</h1>
              <p className="text-gray-500">Manage your class rosters, grades, and engagement</p>
            </div>
            <div className="flex gap-2">
              <Button className="cursor-pointer" onClick={() => setIsNewClassModalOpen(true)}>
                <Plus className="h-4 w-4" />
                New Class
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search classes..."
                      className="pl-8 pr-4 py-2 w-full border rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className={"cursor-pointer"}>
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={view === "grid" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setView("grid")} 
                    className={"cursor-pointer"}
                  >
                    Grid View
                  </Button>
                  <Button 
                    variant={view === "list" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setView("list")} 
                    className={"cursor-pointer"}
                  >
                    List View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Classes */}
          <Tabs defaultValue={defaultTab} onValueChange={navigateToTab} value={activeTab}>
            <TabsList>
              <TabsTrigger 
                value="current" 
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer"
              >
                Current Classes
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer"
              >
                Past Classes
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="text-white data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer"
              >
                All Classes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="mt-6 mb-3">
              <ClassesList 
                classes={filteredClasses.filter(c => c.category === "current")} 
                view={view} 
                navigateToClass={navigateToClass} 
              />
            </TabsContent>
            <TabsContent value="past" className="mt-6 mb-3">
              <ClassesList 
                classes={filteredClasses.filter(c => c.category === "past")} 
                view={view} 
                navigateToClass={navigateToClass} 
              />
            </TabsContent>
            <TabsContent value="all" className="mt-6 mb-3">
              <ClassesList 
                classes={filteredClasses} 
                view={view} 
                navigateToClass={navigateToClass} 
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* New Class Modal */}
        <NewClass 
          isOpen={isNewClassModalOpen}
          onClose={() => setIsNewClassModalOpen(false)}
          onClassCreated={handleClassCreated}
        />
      </Layout>
    );
  };

  export default ClassesPage;