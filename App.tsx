
import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, Settings, Home, Bell, 
  Menu, LogOut, Shield, GraduationCap, Bus, DollarSign,
  FileText, ClipboardList, LayoutDashboard, Search,
  Clock, CheckCircle, MapPin, MoreVertical, Plus, Trash2, Edit,
  Library, Coffee, Activity, MessageSquare, AlertCircle, X, Save,
  TrendingUp, Award, Download, CalendarDays, Utensils, HelpCircle,
  FileDown, Image as ImageIcon, UserCircle, Briefcase, Mail
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User } from './firebase';
import { UserRole, UserProfile, BlogPost, Student, GradeRecord, Assignment, FeeRecord, LibraryBook, BusRoute, UserAccount } from './types';
import { ChatAssistant } from './components/ChatAssistant';

// --- MOCK DATA ---

const MOCK_STATS = [
  { name: 'Jan', attendance: 95 },
  { name: 'Feb', attendance: 92 },
  { name: 'Mar', attendance: 96 },
  { name: 'Apr', attendance: 88 },
  { name: 'May', attendance: 94 },
];

const TEACHER_SCHEDULE = [
  { id: 1, time: '08:00 AM', duration: '45m', subject: 'Mathematics', grade: 'Grade 5-A', room: 'Rm 101', status: 'Completed' },
  { id: 2, time: '09:00 AM', duration: '45m', subject: 'Science', grade: 'Grade 6-B', room: 'Lab 2', status: 'In Progress' },
  { id: 3, time: '10:00 AM', duration: '45m', subject: 'Mathematics', grade: 'Grade 5-B', room: 'Rm 101', status: 'Upcoming' },
  { id: 4, time: '11:30 AM', duration: '45m', subject: 'Physics', grade: 'Grade 8-A', room: 'Lab 1', status: 'Upcoming' },
];

const MOCK_STUDENTS_LIST: Student[] = [
  { id: '1', name: 'Alice Johnson', grade: '5-A', attendance: 'Present', status: 'Active' },
  { id: '2', name: 'Bob Smith', grade: '5-A', attendance: 'Absent', status: 'Active' },
  { id: '3', name: 'Charlie Davis', grade: '5-A', attendance: 'Present', status: 'Active' },
  { id: '4', name: 'Diana Evans', grade: '5-A', attendance: 'Late', status: 'Active' },
  { id: '5', name: 'Evan Wright', grade: '5-A', attendance: 'Present', status: 'Active' },
  { id: '6', name: 'Fiona Green', grade: '5-A', attendance: 'Present', status: 'Active' },
];

const INITIAL_POSTS: BlogPost[] = [
  { id: '1', title: 'Welcome to the New Term', content: 'We are excited to welcome all students back to campus! Please review the new transport schedule.', author: 'Principal', date: '2023-10-01', category: 'Announcement' },
  { id: '2', title: 'Science Fair Winners', content: 'Congratulations to Grade 9 for winning the regional science fair. The projects were outstanding!', author: 'Admin', date: '2023-10-05', category: 'News' }
];

const MOCK_GRADES: GradeRecord[] = [
  { id: '1', subject: 'Mathematics', midterm: 85, final: 92, assignmentAvg: 88, total: 89, letterGrade: 'A', credits: 4 },
  { id: '2', subject: 'English Lit', midterm: 78, final: 82, assignmentAvg: 85, total: 81, letterGrade: 'B', credits: 3 },
  { id: '3', subject: 'General Science', midterm: 90, final: 88, assignmentAvg: 95, total: 91, letterGrade: 'A', credits: 4 },
  { id: '4', subject: 'Social Studies', midterm: 75, final: 79, assignmentAvg: 80, total: 78, letterGrade: 'C+', credits: 3 },
  { id: '5', subject: 'Physical Ed', midterm: 95, final: 98, assignmentAvg: 100, total: 97, letterGrade: 'A+', credits: 2 },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Algebra Worksheet #4', subject: 'Mathematics', dueDate: '2023-10-25', status: 'Pending', totalPoints: 20 },
  { id: '2', title: 'Book Report: To Kill a Mockingbird', subject: 'English Lit', dueDate: '2023-10-20', status: 'Submitted', totalPoints: 50 },
  { id: '3', title: 'Plant Cell Diagram', subject: 'Science', dueDate: '2023-10-15', status: 'Graded', score: 18, totalPoints: 20 },
];

const MOCK_FEES: FeeRecord[] = [
  { id: '1', description: 'Tuition Term 1', amount: 350.00, dueDate: '2023-09-01', status: 'Paid', datePaid: '2023-08-25' },
  { id: '2', description: 'Lab Materials Fee', amount: 45.00, dueDate: '2023-09-15', status: 'Paid', datePaid: '2023-09-10' },
  { id: '3', description: 'Tuition Term 2', amount: 350.00, dueDate: '2024-01-15', status: 'Pending' },
  { id: '4', description: 'Library Fine', amount: 5.00, dueDate: '2023-10-01', status: 'Overdue' },
];

const MOCK_LIBRARY: LibraryBook[] = [
  { id: '1', title: 'Introduction to Physics', author: 'J. Walker', category: 'Science', available: true },
  { id: '2', title: 'Liberian History Vol 1', author: 'A. Konneh', category: 'History', available: true },
  { id: '3', title: 'Advanced Mathematics', author: 'R. Sharma', category: 'Math', available: false },
  { id: '4', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', available: true },
];

const MOCK_BUS_ROUTES: BusRoute[] = [
  { id: '1', name: 'Route A - Johnsonville', driver: 'Mr. Kamara', plateNumber: 'LB-4521', stops: ['City View', 'Market St', 'School'], timing: '07:15 AM' },
  { id: '2', name: 'Route B - Paynesville', driver: 'Mr. Doe', plateNumber: 'LB-9982', stops: ['ELWA Junc', 'Duport Rd', 'School'], timing: '07:00 AM' },
];

const MOCK_USERS: UserAccount[] = [
  { id: '1', name: 'Akin S. Sokpah', email: 'sokpahakinsaye@gmail.com', role: UserRole.ADMIN, status: 'Active', lastLogin: 'Just now' },
  { id: '2', name: 'Sarah Connor', email: 'teacher@school.edu', role: UserRole.TEACHER, status: 'Active', lastLogin: '2 hours ago' },
  { id: '3', name: 'John Doe', email: 'student@school.edu', role: UserRole.STUDENT, status: 'Active', lastLogin: '1 day ago' },
  { id: '4', name: 'Emily Blunt', email: 'emily@school.edu', role: UserRole.STUDENT, status: 'Suspended', lastLogin: '5 days ago' },
];

const CAFETERIA_MENU = [
  { day: 'Monday', meal: 'Jollof Rice & Chicken', price: '$2.50' },
  { day: 'Tuesday', meal: 'Fufu & Soup', price: '$2.00' },
  { day: 'Wednesday', meal: 'Fried Rice & Fish', price: '$2.50' },
  { day: 'Thursday', meal: 'Spaghetti & Meatballs', price: '$3.00' },
  { day: 'Friday', meal: 'Club Sandwich & Juice', price: '$2.00' },
];

const EVENTS = [
  { id: 1, title: 'Parent-Teacher Meeting', date: 'Oct 25, 2024', type: 'Meeting' },
  { id: 2, title: 'Annual Sports Day', date: 'Nov 12, 2024', type: 'Sports' },
  { id: 3, title: 'Science Exhibition', date: 'Dec 05, 2024', type: 'Academic' },
];

// --- COMPONENTS ---

interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
      <Icon className={`text-${color.replace('bg-', '').replace('10', '600')}`} size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);

  // Feature States
  const [userList, setUserList] = useState<UserAccount[]>(MOCK_USERS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS_LIST);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Auth State Inputs
  const [legacyUsername, setLegacyUsername] = useState('');
  const [legacyPassword, setLegacyPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Admin Inputs
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.STUDENT });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        let role = UserRole.STUDENT;
        // Strict Admin Check
        if (firebaseUser.email === 'sokpahakinsaye@gmail.com' || firebaseUser.email === 'akinsokpah3@gmail.com') {
          role = UserRole.ADMIN;
        } else if (firebaseUser.email?.includes('teacher')) {
          role = UserRole.TEACHER;
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: role
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      setLoginError("Google sign in failed.");
    }
  };

  const handleLegacyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Simulate API delay
    setTimeout(() => {
        // ADMIN CREDENTIALS CHECK
        if (legacyUsername === 'akinsokpah3' && legacyPassword === 'Papa...Mama231') {
            setLoginSuccess(true);
            setTimeout(() => {
                setUser({
                    uid: 'legacy-admin-01',
                    email: 'sokpahakinsaye@gmail.com',
                    displayName: 'Akin S. Sokpah',
                    photoURL: null,
                    role: UserRole.ADMIN
                });
                setLoginSuccess(false);
            }, 1000);
        } else {
            setLoginError("Invalid credentials provided. Please check your username and password.");
        }
    }, 800);
  };

  const handleTeacherLogin = () => {
    setUser({
      uid: 'teacher-demo',
      email: 'teacher@school.edu',
      displayName: 'Teacher Sarah',
      photoURL: null,
      role: UserRole.TEACHER
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setLegacyUsername('');
    setLegacyPassword('');
    setActiveTab('dashboard');
  };

  // --- ACTIONS ---

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: newPostTitle,
      content: newPostContent,
      author: user?.displayName || 'Admin',
      date: new Date().toLocaleDateString(),
      category: 'News'
    };
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    alert('Post published successfully!');
  };

  const handleAddUser = () => {
    const u: UserAccount = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'Active',
        lastLogin: 'Never'
    };
    setUserList([...userList, u]);
    setShowUserModal(false);
    setNewUser({ name: '', email: '', role: UserRole.STUDENT });
  };

  const handleDeleteUser = (id: string) => {
    if(confirm('Are you sure you want to delete this user?')) {
        setUserList(userList.filter(u => u.id !== id));
    }
  };

  const toggleAttendance = (id: string) => {
    setStudents(students.map(s => {
        if (s.id === id) {
            const nextStatus = s.attendance === 'Present' ? 'Absent' : s.attendance === 'Absent' ? 'Late' : 'Present';
            return { ...s, attendance: nextStatus };
        }
        return s;
    }));
  };

  // --- UTILS ---
  const calculateGPA = () => {
    const totalCredits = MOCK_GRADES.reduce((acc, curr) => acc + curr.credits, 0);
    const weightedSum = MOCK_GRADES.reduce((acc, curr) => {
        let points = 0;
        if(curr.letterGrade === 'A+') points = 4.0;
        else if(curr.letterGrade === 'A') points = 4.0;
        else if(curr.letterGrade === 'B') points = 3.0;
        else if(curr.letterGrade === 'C+') points = 2.5;
        return acc + (points * curr.credits);
    }, 0);
    return (weightedSum / totalCredits).toFixed(2);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
        <div className="flex-1 bg-blue-900 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="relative z-10 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">School Kids Life Mission</h1>
            <p className="text-xl text-blue-200 mb-8 max-w-lg leading-relaxed">Empowering the future generation of Liberia through excellence in education. Welcome to the iPortal.</p>
            <div className="flex items-center gap-3 text-sm text-blue-300">
               <div className="w-12 h-[1px] bg-blue-400"></div>
               <p>City View Community, Johnsonville</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md p-8">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-200">SK</div>
                <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-500 mt-2">Please sign in to access your portal</p>
            </div>
            
            {loginSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 animate-pulse">
                    <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">Login Successful</h3>
                    <p className="text-slate-500">Redirecting to dashboard...</p>
                </div>
            ) : (
                <>
                    {loginError && <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2"><AlertCircle size={16}/> {loginError}</div>}

                    <form onSubmit={handleLegacyLogin} className="space-y-5 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                        <input 
                        type="text" 
                        value={legacyUsername}
                        onChange={(e) => setLegacyUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50 focus:bg-white"
                        placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot Password?</button>
                        </div>
                        <input 
                        type="password" 
                        value={legacyPassword}
                        onChange={(e) => setLegacyPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50 focus:bg-white"
                        placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 transition transform hover:scale-[1.02]">
                        Secure Login
                    </button>
                    </form>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-400">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-medium transition">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26c.47-1.48 1.48-2.82 2.65-3.57z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Google
                    </button>
                    <button onClick={handleTeacherLogin} className="flex items-center justify-center gap-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 py-3 rounded-xl font-medium transition">
                        <GraduationCap size={20} />
                        Teacher Demo
                    </button>
                    </div>
                </>
            )}
            <div className="mt-12 text-center text-xs text-slate-400">
                &copy; 2024 School Kids Life Mission Portal<br/>Developed by Akin S. Sokpah
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DYNAMIC MENU ---
  let menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'transport', label: 'Transport', icon: Bus },
    { id: 'cafeteria', label: 'Cafeteria', icon: Utensils },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'help', label: 'Support', icon: HelpCircle },
  ];

  if (user.role === UserRole.ADMIN) {
    menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'academics', label: 'Academics', icon: BookOpen },
        { id: 'finance', label: 'Finance', icon: DollarSign },
        { id: 'reports', label: 'System Reports', icon: FileText },
        ...menuItems.slice(1)
    ];
  } else if (user.role === UserRole.TEACHER) {
    menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'attendance', label: 'Attendance', icon: ClipboardList },
        { id: 'grades', label: 'Gradebook', icon: FileText },
        { id: 'students', label: 'My Students', icon: Users },
        { id: 'calendar', label: 'Events', icon: Calendar },
        { id: 'resources', label: 'Resources', icon: FileDown },
    ];
  } else if (user.role === UserRole.STUDENT) {
    menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'grades', label: 'My Grades', icon: FileText },
        { id: 'assignments', label: 'Assignments', icon: BookOpen },
        { id: 'attendance', label: 'Attendance', icon: ClipboardList },
        { id: 'finance', label: 'Fees', icon: DollarSign },
        { id: 'library', label: 'Library', icon: Library },
        { id: 'transport', label: 'Transport', icon: Bus },
        { id: 'cafeteria', label: 'Menu', icon: Utensils },
        { id: 'resources', label: 'Downloads', icon: FileDown },
        { id: 'help', label: 'Support', icon: HelpCircle },
    ];
  }

  // --- MAIN LAYOUT ---
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-20`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-blue-200">
            SK
          </div>
          {isSidebarOpen && (
              <div className="leading-tight">
                  <span className="font-bold text-slate-800 block">Life Mission</span>
                  <span className="text-[10px] text-slate-500 font-medium">PORTAL v2.0</span>
              </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.id}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 hover:text-red-600 w-full px-4 py-3 rounded-xl hover:bg-red-50 transition group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition focus:bg-white" />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
               <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-slate-800">{user.displayName || 'User'}</p>
                 <p className="text-xs text-blue-600 font-medium">{user.role}</p>
               </div>
               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                 {user.displayName ? user.displayName[0] : 'U'}
               </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          
          {/* --- ADMIN: DASHBOARD --- */}
          {activeTab === 'dashboard' && user.role === UserRole.ADMIN && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Users" value={userList.length.toString()} icon={Users} color="bg-blue-600" />
                <StatCard label="New Admissions" value="12" icon={Plus} color="bg-green-600" />
                <StatCard label="Fees Collected" value="$45,200" icon={DollarSign} color="bg-indigo-600" />
                <StatCard label="System Health" value="100%" icon={Activity} color="bg-orange-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-4">Post Announcement</h3>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <input value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} placeholder="Announcement Title" className="w-full px-4 py-2 border rounded-xl" required />
                        <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="Message content..." className="w-full px-4 py-2 border rounded-xl h-24 resize-none" required />
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition w-full">Publish to Portal</button>
                    </form>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                          {[1,2,3].map(i => (
                              <div key={i} className="flex gap-4 items-start border-b border-slate-50 pb-3 last:border-0">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs">LOG</div>
                                  <div>
                                      <p className="text-sm text-slate-800 font-medium">New student registration: Student #{202400+i}</p>
                                      <p className="text-xs text-slate-400">2 hours ago</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* --- ADMIN: USER MANAGEMENT --- */}
          {activeTab === 'users' && user.role === UserRole.ADMIN && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                      <button onClick={() => setShowUserModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-200 transition">
                          <Plus size={18} /> Add User
                      </button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full">
                          <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name / Email</th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {userList.map((u) => (
                                  <tr key={u.id} className="hover:bg-slate-50 transition">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                  {u.name[0]}
                                              </div>
                                              <div>
                                                  <p className="text-sm font-bold text-slate-800">{u.name}</p>
                                                  <p className="text-xs text-slate-500">{u.email}</p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                              u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                                              u.role === UserRole.TEACHER ? 'bg-orange-100 text-orange-700' :
                                              'bg-blue-100 text-blue-700'
                                          }`}>{u.role}</span>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className={`flex items-center gap-1.5 text-xs font-bold ${u.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                              {u.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition"><Trash2 size={16} /></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  {/* Add User Modal */}
                  {showUserModal && (
                      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
                              <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add New User</h3>
                                <button onClick={() => setShowUserModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                              </div>
                              <div className="space-y-4">
                                  <input className="w-full border p-2 rounded-lg" placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                                  <input className="w-full border p-2 rounded-lg" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                                  <select className="w-full border p-2 rounded-lg" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}>
                                      <option value={UserRole.STUDENT}>Student</option>
                                      <option value={UserRole.TEACHER}>Teacher</option>
                                      <option value={UserRole.ADMIN}>Admin</option>
                                  </select>
                                  <button onClick={handleAddUser} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium mt-4">Create Account</button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* --- TEACHER: DASHBOARD --- */}
           {activeTab === 'dashboard' && user.role === UserRole.TEACHER && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-2xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-blue-100 text-sm font-medium mb-1">My Students</p>
                      <h3 className="text-3xl font-bold">128</h3>
                   </div>
                   <Users className="absolute right-4 bottom-4 text-white/20 w-24 h-24" />
                </div>
                <StatCard label="Assigned Classes" value="4" icon={BookOpen} color="bg-orange-500" />
                <StatCard label="Pending Assignments" value="23" icon={ClipboardList} color="bg-pink-500" />
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Today's Schedule</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {TEACHER_SCHEDULE.map((slot) => (
                      <div key={slot.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div className="min-w-[100px] text-center">
                           <p className="font-bold text-slate-800">{slot.time.split(' - ')[0]}</p>
                           <p className="text-xs text-slate-500 mt-1">{slot.duration}</p>
                        </div>
                        <div className="flex-1">
                             <h4 className="font-bold text-slate-800">{slot.subject}</h4>
                             <p className="text-sm text-slate-600">{slot.grade} • {slot.room}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100">{slot.status}</span>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          )}

          {/* --- TEACHER: ATTENDANCE --- */}
          {activeTab === 'attendance' && user.role === UserRole.TEACHER && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-800">Class Attendance</h2>
                      <div className="flex gap-3">
                          <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Save Record</button>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {students.map((student) => (
                          <div key={student.id} onClick={() => toggleAttendance(student.id)} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                              student.attendance === 'Present' ? 'bg-green-50 border-green-200' :
                              student.attendance === 'Absent' ? 'bg-red-50 border-red-200' :
                              'bg-yellow-50 border-yellow-200'
                          }`}>
                              <h3 className="font-bold text-slate-800">{student.name}</h3>
                              <p className={`mt-2 inline-block px-2 py-1 rounded text-xs font-bold uppercase ${
                                  student.attendance === 'Present' ? 'bg-green-200 text-green-800' :
                                  student.attendance === 'Absent' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                              }`}>{student.attendance}</p>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* --- STUDENT: GRADES --- */}
          {activeTab === 'grades' && user.role === UserRole.STUDENT && (
              <div className="space-y-8 animate-fade-in">
                  <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-8 rounded-2xl shadow-xl flex justify-between items-center">
                      <div>
                          <h2 className="text-3xl font-bold">Academic Report</h2>
                          <p className="text-blue-200">Fall Semester 2024 • Grade 5</p>
                      </div>
                      <div className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-md">
                          <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">GPA</p>
                          <p className="text-4xl font-bold">{calculateGPA()}</p>
                      </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full min-w-[800px]">
                          <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Subject</th>
                                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Midterm</th>
                                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Final</th>
                                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Total</th>
                                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Grade</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {MOCK_GRADES.map((grade) => (
                                  <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-6 py-5 font-bold text-slate-800">{grade.subject}</td>
                                      <td className="px-6 py-5 text-center text-slate-600">{grade.midterm}%</td>
                                      <td className="px-6 py-5 text-center text-slate-600">{grade.final}%</td>
                                      <td className="px-6 py-5 text-center font-bold text-slate-800">{grade.total}%</td>
                                      <td className="px-6 py-5 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">{grade.letterGrade}</span></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* --- SHARED: CALENDAR --- */}
          {activeTab === 'calendar' && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-slate-800">School Calendar & Events</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="font-bold text-lg">Upcoming Events</h3>
                              <button className="text-blue-600 text-sm font-medium">View All</button>
                          </div>
                          <div className="space-y-4">
                              {EVENTS.map((evt) => (
                                  <div key={evt.id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex flex-col items-center justify-center font-bold">
                                          <span className="text-xs uppercase">{evt.date.split(' ')[0]}</span>
                                          <span className="text-lg">{evt.date.split(' ')[1].replace(',', '')}</span>
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-slate-800">{evt.title}</h4>
                                          <p className="text-sm text-slate-500">{evt.type} • School Hall</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="bg-blue-600 text-white p-6 rounded-2xl">
                          <h3 className="font-bold text-lg mb-4">Important Dates</h3>
                          <ul className="space-y-3 text-blue-100 text-sm">
                              <li>• Oct 31: Term 1 Ends</li>
                              <li>• Nov 01: Holiday</li>
                              <li>• Nov 15: Exam Start</li>
                              <li>• Dec 20: Winter Break</li>
                          </ul>
                      </div>
                  </div>
              </div>
          )}

           {/* --- SHARED: CAFETERIA --- */}
           {activeTab === 'cafeteria' && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-800">Weekly Lunch Menu</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {CAFETERIA_MENU.map((item, idx) => (
                           <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition">
                               <div className="flex justify-between items-start mb-2">
                                   <span className="text-xs font-bold uppercase text-slate-400">{item.day}</span>
                                   <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-sm">{item.price}</span>
                               </div>
                               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                   <Utensils size={18} className="text-orange-500"/> {item.meal}
                               </h3>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* --- SHARED: LIBRARY --- */}
           {activeTab === 'library' && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-800">Digital Library</h2>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                       {MOCK_LIBRARY.map((book) => (
                           <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
                               <div className="h-40 bg-slate-200 flex items-center justify-center relative">
                                   <BookOpen className="text-slate-400 w-12 h-12" />
                                   {!book.available && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Out</span>}
                               </div>
                               <div className="p-4">
                                   <p className="text-xs text-blue-600 font-bold mb-1 uppercase">{book.category}</p>
                                   <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{book.title}</h3>
                                   <p className="text-sm text-slate-500">{book.author}</p>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* --- SHARED: TRANSPORT --- */}
           {activeTab === 'transport' && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-800">Transport</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {MOCK_BUS_ROUTES.map((route) => (
                           <div key={route.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                               <h3 className="text-lg font-bold text-slate-800 mb-2">{route.name}</h3>
                               <p className="text-sm text-slate-500 mb-4">Driver: {route.driver} • {route.plateNumber}</p>
                               <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                                   {route.stops.map((stop, i) => (
                                       <div key={i} className="text-sm">
                                           <span className="font-bold text-slate-700">{stop}</span>
                                           <span className="text-slate-400 ml-2 text-xs">{i === 0 ? route.timing : `+${i*15}m`}</span>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}

           {/* --- STUDENT: FINANCE --- */}
           {activeTab === 'finance' && user.role === UserRole.STUDENT && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-800">Financial Records</h2>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <table className="w-full">
                          <thead className="bg-slate-50">
                              <tr>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500">Item</th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500">Due</th>
                                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500">Status</th>
                                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500">Amount</th>
                              </tr>
                          </thead>
                          <tbody>
                              {MOCK_FEES.map((fee) => (
                                  <tr key={fee.id} className="border-t border-slate-100">
                                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{fee.description}</td>
                                      <td className="px-6 py-4 text-sm text-slate-500">{fee.dueDate}</td>
                                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{fee.status}</span></td>
                                      <td className="px-6 py-4 text-right font-bold text-slate-700">${fee.amount.toFixed(2)}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                   </div>
               </div>
           )}

           {/* --- SHARED: RESOURCES (Downloads) --- */}
           {activeTab === 'resources' && (
               <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-800">Downloads & Resources</h2>
                   <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                       <div className="space-y-4">
                           {['Student Handbook 2024.pdf', 'Exam Schedule Fall.pdf', 'Permission Slip - Field Trip.docx', 'Mathematics Syllabus G5.pdf'].map((file, i) => (
                               <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                                   <div className="flex items-center gap-3">
                                       <FileText className="text-blue-600" size={24} />
                                       <span className="font-medium text-slate-700">{file}</span>
                                   </div>
                                   <button className="text-slate-400 hover:text-blue-600"><Download size={20}/></button>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}

           {/* --- SHARED: SUPPORT --- */}
           {activeTab === 'help' && (
               <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-bold text-slate-800 text-center">Help & Support</h2>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                       <form className="space-y-4">
                           <div>
                               <label className="block text-sm font-medium mb-1">Subject</label>
                               <input type="text" className="w-full border p-3 rounded-xl" placeholder="How can we help?" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium mb-1">Message</label>
                               <textarea className="w-full border p-3 rounded-xl h-32" placeholder="Describe your issue..."></textarea>
                           </div>
                           <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Submit Ticket</button>
                       </form>
                   </div>
               </div>
           )}

          {/* --- COMMON: DASHBOARD (STUDENT/ADMIN fallback) --- */}
          {activeTab === 'dashboard' && user.role !== UserRole.TEACHER && user.role !== UserRole.ADMIN && (
            <div className="space-y-8 animate-fade-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Overall GPA" value={calculateGPA()} icon={Activity} color="bg-blue-600" />
                <StatCard label="Attendance" value="96%" icon={ClipboardList} color="bg-green-600" />
                <StatCard label="Assignments" value="2 Pending" icon={FileText} color="bg-orange-500" />
                <StatCard label="Library Books" value="1 Due" icon={BookOpen} color="bg-purple-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Overview</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_STATS}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip />
                        <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* News Feed */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[400px]">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-blue-600" />
                    Latest Updates
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                    {posts.map((post) => (
                      <div key={post.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-sm transition">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full mb-2 inline-block">{post.category}</span>
                        <h4 className="font-semibold text-slate-800 text-sm mb-1">{post.title}</h4>
                        <p className="text-slate-500 text-xs line-clamp-2">{post.content}</p>
                        <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
                          <span>{post.author}</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for unfinished pages */}
          {['gallery', 'reports', 'academics'].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center h-[500px] text-center animate-fade-in">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                 <Settings size={48} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2 capitalize">{activeTab} Module</h3>
               <p className="text-slate-500 max-w-md">
                 This feature is currently under active development. <br/>
                 Expected rollout: Q4 2024.
               </p>
               <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                 Return to Dashboard
               </button>
             </div>
          )}

        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-300 pointer-events-none opacity-50">
          iPortal v2.0 • Licensed to School Kids Life Mission
        </div>
      </main>

      {/* Floating Chat */}
      <ChatAssistant />
    </div>
  );
};

export default App;
