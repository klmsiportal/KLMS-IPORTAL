
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  GUEST = 'GUEST'
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'Announcement' | 'Event' | 'News';
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: string; // Present, Absent, Late
  status: 'Active' | 'Inactive';
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- NEW TYPES ---

export interface GradeRecord {
  id: string;
  subject: string;
  midterm: number;
  final: number;
  assignmentAvg: number;
  total: number;
  letterGrade: string;
  credits: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  score?: number;
  totalPoints: number;
}

export interface FeeRecord {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  datePaid?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  coverUrl?: string;
}

export interface BusRoute {
  id: string;
  name: string;
  driver: string;
  plateNumber: string;
  stops: string[];
  timing: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
}
