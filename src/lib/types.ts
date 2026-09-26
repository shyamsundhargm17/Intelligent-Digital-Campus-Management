export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  createdAt: Date;
  
  // Student specific fields
  enrollmentNo?: string;
  semester?: number;
  
  // Faculty specific fields
  employeeId?: string;
  designation?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  title: string;
  description: string;
  department: string; // e.g., 'IT Services', 'Facilities', 'Accounts'
  status: 'Pending' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  updatedAt: Date;
  resolvedBy?: string; // UID of faculty/admin
  resolutionNotes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  subjectCode: string;
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  markedBy: string; // UID of faculty
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  tag: 'Important' | 'Event' | 'Admin' | 'General';
  postedBy: string; // UID of faculty/admin
  department: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  organizer: string;
  imageUrl?: string;
}
