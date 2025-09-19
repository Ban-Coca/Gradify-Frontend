// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        // Azure OAuth
        AZURE_LOGIN: '/api/auth/azure/login',
        AZURE_CALLBACK: '/api/auth/azure/callback',
        FINALIZE_TEACHER: '/api/auth/azure/finalize-teacher',
        FINALIZE_STUDENT: '/api/auth/azure/finalize-student',
        
        // Google OAuth
        GOOGLE_FINALIZE: '/api/auth/google/finalize', // + /{role} path param
    },
    
    USER: {
        // Authentication
        LOGIN: '/api/user/login',
        REGISTER: '/api/user/register',
        OAUTH2_FAILURE: '/api/user/oauth2/failure',
        CHECK_EMAIL_EXISTS: '/api/user/email-exists',
        
        // Profile Management
        UPDATE_PROFILE: '/api/user/update-profile',
        GET_ALL: '/api/user',
        DELETE: '/api/user', // + /{userId} path param
        GET_BY_ID: '/api/user', // + /{userId} path param
        UPDATE_USER: '/api/user/update-user', // + /{userId} path param
        UPDATE_ROLE: '/api/user/update-role', // + /{userId} path param
        
        // Password Reset
        REQUEST_PASSWORD_RESET: '/api/user/request-password-reset',
        VERIFY_RESET_CODE: '/api/user/verify-reset-code',
        RESET_PASSWORD: '/api/user/reset-password',
        RESEND_CODE: '/api/user/resend-code'
    },
    
    // Student Related
    STUDENT: {
        // Classes & Grades
        CLASSES: '/api/student', // + /{studentId}/classes
        CLASS_GRADES: '/api/student', // + /{studentId}/classes/{classId}/grades
        CALCULATED_GRADE: '/api/student', // + /{studentId}/classes/{classId}/calculated-grade
        GRADING_SCHEME: '/api/student/classes', // + /{classId}/grading-scheme
        CLASS_TEACHER: '/api/student/classes', // + /{classId}/teacher
        
        // Reports & Analytics
        REPORTS: '/api/student', // + /{studentId}/reports
        AVERAGE_PERCENTAGE: '/api/student', // + /{studentId}/average-percentage
        GRADE_RECORDS: '/api/student', // + /{studentId}/grade-records
        ALL_GRADES: '/api/student', // + /{studentId}/all-grades
        CLASS_AVERAGES: '/api/student', // + /{studentId}/class-averages
        
        // Student Number Lookup
        BY_STUDENT_NUMBER_CLASS: '/api/student', // + /{studentNumber}/class/{classId}
        BY_STUDENT_NUMBER_ALL: '/api/student', // + /{studentNumber}/all
    },
    
    // Teacher Related
    TEACHER: {
        // Class Management
        CREATE_CLASS: '/api/teacher',
        GET_CLASSES: '/api/teacher',
        GET_CLASS: '/api/teacher', // + /{classId}
        UPDATE_CLASS: '/api/teacher', // + /{classId}
        DELETE_CLASS: '/api/teacher', // + /{classId}
        
        // Analytics & Statistics
        STUDENTS_COUNT: '/api/teacher', // + /{teacherId}/students/count
        RISK_STUDENTS_COUNT: '/api/teacher', // + /{teacherId}/risk/students/count
        TOP_STUDENTS_COUNT: '/api/teacher', // + /{teacherId}/top/students/count
        GRADE_DISTRIBUTION: '/api/teacher', // + /{teacherId}/grade/distribution
        CLASS_PERFORMANCE: '/api/teacher', // + /{teacherId}/class/performance
        AI_ANALYTICS: '/api/teacher', // + /{classId}/ai/analytics
        
        // Assessment Visibility Management
        AVAILABLE_ASSESSMENTS: '/api/teacher/class-spreadsheet', // + /{classId}/assessments/available
        VISIBLE_ASSESSMENTS: '/api/teacher/class-spreadsheet', // + /{classId}/assessments/visible
        UPDATE_VISIBLE_ASSESSMENTS: '/api/teacher/class-spreadsheet', // + /{classSpreadsheetId}/assessments/visible
        TOGGLE_ASSESSMENT: '/api/teacher', // + /{classSpreadsheetId}/assessments/{assessmentName}/toggle
        ASSESSMENT_STATUS: '/api/teacher', // + /{classSpreadsheetId}/assessments/status
        STUDENT_DETAIL: '/api/teacher', // + /class/{classId}/student/{studentId}
    },
    
    // Reports
    REPORTS: {
        CREATE: '/api/reports',
        GET_BY_ID: '/api/reports', // + /{reportId}
        GET_BY_STUDENT: '/api/reports/student', // + /{studentId}
        GET_BY_TEACHER: '/api/reports/teacher', // + /{teacherId}
        GET_BY_CLASS: '/api/reports/class', // + /{classId}
        UPDATE: '/api/reports', // + /{reportId}
        DELETE: '/api/reports', // + /{reportId}
        GENERATE_SUGGESTION: '/api/reports/generate-suggestion/student', // + /{studentId}/class/{classId}
    },
    
    // Notifications
    NOTIFICATIONS: {
        GET_USER_NOTIFICATIONS: '/api/notification/get-notifications', // + /{userId}
        GET_UNREAD_COUNT: '/api/notification/unread/count', // + /{userId}
        GET_UNREAD: '/api/notification/unread', // + /{userId}
        MARK_AS_READ: '/api/notification', // + /{id}/read
        MARK_ALL_AS_READ: '/api/notification/read-all', // + /{userId}
    },
    
    // Classes Management
    CLASSES: {
        CREATE: '/api/classes',
        GET_ALL: '/api/classes',
        GET_BY_ID: '/api/classes', // + /{classId}
        UPDATE: '/api/classes', // + /{classId}
        DELETE: '/api/classes', // + /{classId}
        GET_SPREADSHEETS: '/api/classes', // + /{classId}/spreadsheets
        GET_BY_TEACHER: '/api/classes/teacher', // + /{teacherId}
        GET_STUDENTS: '/api/classes', // + /{classId}/students
        GET_STUDENT_GRADE: '/api/classes', // + /{classId}/students/{studentId}/grade
        GET_GRADE_AVERAGE: '/api/classes', // + /{classId}/grade/average
        GET_STUDENTS_COUNT: '/api/classes', // + /{classId}/students/count
        GET_STUDENTS_DETAILS: '/api/classes', // + /{classId}/students/details
    },
    
    // Grading Schemes
    GRADING: {
        SAVE_SCHEME: '/api/grading/save',
        GET_SCHEMES: '/api/grading/schemes',
        UPDATE_SCHEME: '/api/grading/class', // + /{classId}/teacher/{teacherId}
    },
    
    // Records & Analytics
    RECORDS: {
        CALCULATE_STUDENT_GRADE: '/api/records/calculate/student',
        CALCULATE_CLASS_GRADES: '/api/records/calculate/class',
    },
    
    // Spreadsheet Management
    SPREADSHEET: {
        UPLOAD: '/api/spreadsheet/upload',
        UPDATE: '/api/spreadsheet/update', // + /{classId}
        PROCESS_URL: '/api/spreadsheet/process-url',
        CHECK_URL_SUPPORT: '/api/spreadsheet/check-url-support',
        GET_BY_ID: '/api/spreadsheet', // + /{id}
        CHECK_GOOGLE_SHEETS_CONFIG: '/api/spreadsheet/check-google-sheets-config',
        CHECK_EXISTS: '/api/spreadsheet/check-exists',
    },
    
    // Microsoft Graph Integration
    MICROSOFT_GRAPH: {
        // Drive Operations
        GET_ROOT_FILES: '/api/graph/drive/root',
        GET_FOLDER_FILES: '/api/graph/drive/folder', // + /{folderId}/files
        EXTRACT_EXCEL: '/api/graph/extract', // + /{folderName}/{fileName}
        SAVE_EXCEL: '/api/graph/save', // + /{folderName}/{fileName}
        
        // Notifications & Subscriptions
        CREATE_SUBSCRIPTION: '/api/graph/notification/subscribe',
        HANDLE_NOTIFICATION: '/api/graph/notification',
        TRACKED_FILES: '/api/graph/tracked-files',
        UNSUBSCRIBE: '/api/graph/subscription', // DELETE MAPPING
        RENEW_SUBSCRIPTION: '/api/graph/subscription/renew',
        SUBSCRIPTION_STATUS: '/api/graph/subscription/status',
        SYNC_EXCEL: '/api/graph/sync-excel-sheet' // + ?userId={usesrId}&sheetId={sheetId}

    },
    GOOGLE: {
        GET_ACCESS_TOKEN: '/api/google/access-token', // + ?userId={userId}
        SAVE_SHEET: '/api/google/drive/save', // + ?userId={userId}&urlLink={urlLink}
        SYNC_SHEET: '/api/google/sync-sheet' // + ?userId={usesrId}&sheetId={sheetId}
    },
    // FCM (Firebase Cloud Messaging) for Push Notifications
    FCM: {
        REGISTER_DEVICE: '/api/fcm/register-device',
        REVOKE_DEVICE: '/api/fcm/revoke-device',
    },
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
    THEME: 'theme',
    LANGUAGE: 'language',
};