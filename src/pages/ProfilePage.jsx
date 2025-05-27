import React, { useState } from 'react';
import Layout from "@/components/layout";
import { User, Mail, Calendar, MapPin, Edit, Camera, Save, X, Phone, Briefcase, GraduationCap, BookOpen, Users, Award, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from "@/contexts/authentication-context";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { userRole, currentUser } = useAuth(); // Get both role and user data

  
  // Base profile data structure that works for both roles
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || 'Alex',
    lastName: currentUser?.lastName || 'Johnson',
    email: currentUser?.email || 'alex.johnson@gradify.com',
    phone: currentUser?.phone || '+1 (555) 123-4567',
    bio: userRole === 'TEACHER' 
      ? 'Passionate educator with 8 years of experience in mathematics and computer science. I believe in making complex concepts accessible and engaging for all students.'
      : 'Dedicated student pursuing a degree in Computer Science. I enjoy problem-solving and am particularly interested in web development and artificial intelligence.',
    location: 'San Francisco, CA',
    joinDate: userRole === 'TEACHER' ? 'August 2020' : 'September 2023',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    
    // Teacher-specific fields
    ...(userRole === 'TEACHER' && {
      position: 'Senior Mathematics Teacher',
      department: 'Mathematics & Computer Science',
      specialization: 'Algebra, Calculus, Programming',
      yearsExperience: '8 years',
      education: 'M.Ed in Mathematics Education',
      coursesTeaching: 'Algebra II, Calculus AB, AP Computer Science'
    }),
    
    // Student-specific fields
    ...(userRole === 'STUDENT' && {
      studentId: 'CS2023001',
      major: 'Computer Science',
      year: 'Sophomore',
      gpa: '3.8',
      expectedGraduation: 'May 2027',
      advisor: 'Dr. Sarah Mitchell'
    })
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const getUserInitials = () => {
    return `${profileData.firstName?.charAt(0) || ''}${profileData.lastName?.charAt(0) || ''}`;
  };

  // Render teacher-specific work information
  const renderTeacherWorkInfo = () => (
    <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-green-100 rounded-lg">
            <Briefcase className="h-5 w-5 text-green-600" />
          </div>
          Teaching Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="font-medium text-slate-900">{profileData.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Specialization</p>
                <p className="font-medium text-slate-900">{profileData.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Experience</p>
                <p className="font-medium text-slate-900">{profileData.yearsExperience}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Award className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Education</p>
                <p className="font-medium text-slate-900">{profileData.education}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="department" className="text-sm font-medium text-slate-700">Department</Label>
              <Input
                id="department"
                value={editData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="specialization" className="text-sm font-medium text-slate-700">Specialization</Label>
              <Input
                id="specialization"
                value={editData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="yearsExperience" className="text-sm font-medium text-slate-700">Years of Experience</Label>
              <Input
                id="yearsExperience"
                value={editData.yearsExperience}
                onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="education" className="text-sm font-medium text-slate-700">Education</Label>
              <Input
                id="education"
                value={editData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Render student-specific academic information
  const renderStudentAcademicInfo = () => (
    <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <School className="h-5 w-5 text-blue-600" />
          </div>
          Academic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Student ID</p>
                <p className="font-medium text-slate-900">{profileData.studentId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Major</p>
                <p className="font-medium text-slate-900">{profileData.major}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Academic Year</p>
                <p className="font-medium text-slate-900">{profileData.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Award className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">GPA</p>
                <p className="font-medium text-slate-900">{profileData.gpa}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentId" className="text-sm font-medium text-slate-700">Student ID</Label>
              <Input
                id="studentId"
                value={editData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="major" className="text-sm font-medium text-slate-700">Major</Label>
              <Input
                id="major"
                value={editData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="year" className="text-sm font-medium text-slate-700">Academic Year</Label>
              <Input
                id="year"
                value={editData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gpa" className="text-sm font-medium text-slate-700">GPA</Label>
              <Input
                id="gpa"
                value={editData.gpa}
                onChange={(e) => handleInputChange('gpa', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Render additional info card for teachers (courses teaching)
  const renderTeacherCoursesCard = () => (
    <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          Current Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-slate-700 leading-relaxed">{profileData.coursesTeaching}</p>
          </div>
        ) : (
          <div>
            <Label htmlFor="coursesTeaching" className="text-sm font-medium text-slate-700 mb-2 block">Courses Teaching</Label>
            <Textarea
              id="coursesTeaching"
              value={editData.coursesTeaching}
              onChange={(e) => handleInputChange('coursesTeaching', e.target.value)}
              rows={3}
              className="resize-none"
              placeholder="List the courses you're currently teaching..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Render additional info card for students (advisor & graduation)
  const renderStudentAdditionalInfo = () => (
    <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Academic Advisor</p>
                <p className="font-medium text-slate-900">{profileData.advisor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Expected Graduation</p>
                <p className="font-medium text-slate-900">{profileData.expectedGraduation}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="advisor" className="text-sm font-medium text-slate-700">Academic Advisor</Label>
              <Input
                id="advisor"
                value={editData.advisor}
                onChange={(e) => handleInputChange('advisor', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="expectedGraduation" className="text-sm font-medium text-slate-700">Expected Graduation</Label>
              <Input
                id="expectedGraduation"
                value={editData.expectedGraduation}
                onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {userRole === 'TEACHER' ? 'Teacher Profile' : 'Student Profile'}
            </h1>
            <p className="text-slate-600 mt-1">
              {userRole === 'TEACHER' 
                ? 'Manage your teaching profile and information' 
                : 'Manage your student profile and academic information'
              }
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-slate-300 hover:bg-slate-50">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Main Profile Card */}
        <Card className="overflow-hidden border-0 shadow-lg bg-white">
          <div className="h-32 bg-gradient-to-r from-primary to-green-400 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <CardContent className="relative pt-0 pb-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 relative z-10">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <AvatarImage src={profileData.profileImage} alt={`${profileData.firstName} ${profileData.lastName}`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-green-400 text-white text-2xl font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 sm:mb-4">
                <div className="bg-white rounded-xl p-6 shadow-md border">
                  {!isEditing ? (
                    <>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      <p className="text-lg text-primary font-medium mb-2">
                        {userRole === 'TEACHER' ? profileData.position : `${profileData.major} Student`}
                      </p>
                      <p className="text-slate-600">
                        {userRole === 'TEACHER' ? profileData.department : `${profileData.year} • ${profileData.major}`}
                      </p>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</Label>
                          <Input
                            id="firstName"
                            value={editData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</Label>
                          <Input
                            id="lastName"
                            value={editData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      {userRole === 'TEACHER' && (
                        <div>
                          <Label htmlFor="position" className="text-sm font-medium text-slate-700">Position</Label>
                          <Input
                            id="position"
                            value={editData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information - Same for both roles */}
          <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium text-slate-900">{profileData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="font-medium text-slate-900">{profileData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="font-medium text-slate-900">{profileData.location}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</Label>
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-slate-700">Location</Label>
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role-specific information card */}
          {userRole === 'TEACHER' ? renderTeacherWorkInfo() : renderStudentAcademicInfo()}
        </div>

        {/* Role-specific additional cards */}
        {userRole === 'TEACHER' && renderTeacherCoursesCard()}
        {userRole === 'STUDENT' && renderStudentAdditionalInfo()}

        {/* Bio Section - Same for both roles but with role-specific content */}
        <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-red-100 rounded-lg">
                <User className="h-5 w-5 text-red-600" />
              </div>
              {userRole === 'TEACHER' ? 'Teaching Philosophy' : 'About Me'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-slate-700 leading-relaxed">{profileData.bio}</p>
              </div>
            ) : (
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-slate-700 mb-2 block">
                  {userRole === 'TEACHER' ? 'Teaching Philosophy' : 'Bio'}
                </Label>
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="resize-none"
                  placeholder={userRole === 'TEACHER' 
                    ? "Share your teaching philosophy and approach..." 
                    : "Tell us about yourself..."
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}