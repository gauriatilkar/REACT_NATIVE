export interface Branch {
  id: string;
  name: string;
  location: string;
  totalStudents: number;
  presentToday: number;
  revenue: number;
  coaches: number;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  branchId: string;
  batchId: string;
  joiningDate: string;
  phone: string;
  email: string;
  feeStatus: 'paid' | 'due' | 'partial';
  feeAmount: number;
  feePaid: number;
  lastAttendance: string;
  attendancePercentage: number;
  photo?: string;
}

export interface Batch {
  id: string;
  name: string;
  branchId: string;
  coachId: string | null;   // UPDATED HERE
  timing: string;
  days: string[];
  capacity: number;
  enrolled: number;
}

export interface Coach {
  id: string;
  name: string;
  branchId: string;
  experience: number;
  phone: string;
  email: string;
  specialization: string;
  salary: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  branchId: string;
}

// ------------------ Branches ------------------

export const branches: Branch[] = [
  {
    id: 'all',
    name: 'All Branches',
    location: 'Overall',
    totalStudents: 324,
    presentToday: 256,
    revenue: 145000,
    coaches: 18,
  },
  {
    id: 'b1',
    name: 'Vijay Nagar',
    location: 'Vijay Nagar, Indore',
    totalStudents: 124,
    presentToday: 98,
    revenue: 55000,
    coaches: 8,
  },
  {
    id: 'b2',
    name: 'Palasia',
    location: 'Palasia Square, Indore',
    totalStudents: 98,
    presentToday: 82,
    revenue: 45000,
    coaches: 6,
  },
  {
    id: 'b3',
    name: 'Rau',
    location: 'Rau, Indore',
    totalStudents: 102,
    presentToday: 76,
    revenue: 45000,
    coaches: 4,
  },
];

// ------------------ Students ------------------

export const students: Student[] = [
  {
    id: 's1',
    name: 'Rahul Sharma',
    age: 16,
    branchId: 'b1',
    batchId: 'batch1',
    joiningDate: '2024-01-15',
    phone: '+91 98765 43210',
    email: 'rahul@example.com',
    feeStatus: 'paid',
    feeAmount: 5000,
    feePaid: 5000,
    lastAttendance: '2024-11-19',
    attendancePercentage: 92,
  },
  {
    id: 's2',
    name: 'Priya Patel',
    age: 14,
    branchId: 'b1',
    batchId: 'batch1',
    joiningDate: '2024-02-10',
    phone: '+91 98765 43211',
    email: 'priya@example.com',
    feeStatus: 'due',
    feeAmount: 5000,
    feePaid: 0,
    lastAttendance: '2024-11-18',
    attendancePercentage: 88,
  },
  {
    id: 's3',
    name: 'Amit Kumar',
    age: 17,
    branchId: 'b1',
    batchId: 'batch2',
    joiningDate: '2024-01-20',
    phone: '+91 98765 43212',
    email: 'amit@example.com',
    feeStatus: 'paid',
    feeAmount: 5000,
    feePaid: 5000,
    lastAttendance: '2024-11-19',
    attendancePercentage: 95,
  },
  {
    id: 's4',
    name: 'Sneha Singh',
    age: 15,
    branchId: 'b2',
    batchId: 'batch3',
    joiningDate: '2024-03-05',
    phone: '+91 98765 43213',
    email: 'sneha@example.com',
    feeStatus: 'partial',
    feeAmount: 5000,
    feePaid: 2500,
    lastAttendance: '2024-11-19',
    attendancePercentage: 85,
  },
  {
    id: 's5',
    name: 'Rohan Verma',
    age: 16,
    branchId: 'b2',
    batchId: 'batch3',
    joiningDate: '2024-02-15',
    phone: '+91 98765 43214',
    email: 'rohan@example.com',
    feeStatus: 'paid',
    feeAmount: 5000,
    feePaid: 5000,
    lastAttendance: '2024-11-19',
    attendancePercentage: 90,
  },
  {
    id: 's6',
    name: 'Anjali Gupta',
    age: 14,
    branchId: 'b3',
    batchId: 'batch4',
    joiningDate: '2024-01-10',
    phone: '+91 98765 43215',
    email: 'anjali@example.com',
    feeStatus: 'due',
    feeAmount: 5000,
    feePaid: 0,
    lastAttendance: '2024-11-17',
    attendancePercentage: 78,
  },
];

// ------------------ Batches (UPDATED coachId) ------------------

export const batches: Batch[] = [
  {
    id: 'batch1',
    name: 'Morning Beginners',
    branchId: 'b1',
    coachId: 'c1',
    timing: '6:00 AM - 7:30 AM',
    days: ['Mon', 'Wed', 'Fri'],
    capacity: 20,
    enrolled: 18,
  },
  {
    id: 'batch2',
    name: 'Evening Advanced',
    branchId: 'b1',
    coachId: 'c2',
    timing: '5:00 PM - 6:30 PM',
    days: ['Tue', 'Thu', 'Sat'],
    capacity: 15,
    enrolled: 14,
  },
  {
    id: 'batch3',
    name: 'Morning Intermediate',
    branchId: 'b2',
    coachId: 'c3',
    timing: '7:00 AM - 8:30 AM',
    days: ['Mon', 'Wed', 'Fri'],
    capacity: 18,
    enrolled: 16,
  },
  {
    id: 'batch4',
    name: 'Evening Beginners',
    branchId: 'b3',
    coachId: 'c4',
    timing: '4:00 PM - 5:30 PM',
    days: ['Tue', 'Thu', 'Sat'],
    capacity: 20,
    enrolled: 19,
  },
];

// ------------------ Coaches ------------------

export const coaches: Coach[] = [
  {
    id: 'c1',
    name: 'Vikram Singh',
    branchId: 'b1',
    experience: 8,
    phone: '+91 98765 11111',
    email: 'vikram@onfit.com',
    specialization: 'Beginners',
    salary: 35000,
  },
  {
    id: 'c2',
    name: 'Rajesh Kumar',
    branchId: 'b1',
    experience: 12,
    phone: '+91 98765 22222',
    email: 'rajesh@onfit.com',
    specialization: 'Advanced',
    salary: 45000,
  },
  {
    id: 'c3',
    name: 'Suresh Patel',
    branchId: 'b2',
    experience: 10,
    phone: '+91 98765 33333',
    email: 'suresh@onfit.com',
    specialization: 'Intermediate',
    salary: 40000,
  },
  {
    id: 'c4',
    name: 'Mahesh Sharma',
    branchId: 'b3',
    experience: 6,
    phone: '+91 98765 44444',
    email: 'mahesh@onfit.com',
    specialization: 'Beginners',
    salary: 32000,
  },
];

// ------------------ Attendance ------------------

export const attendance: Attendance[] = [
  { id: 'a1', studentId: 's1', date: '2024-11-19', status: 'present', branchId: 'b1' },
  { id: 'a2', studentId: 's2', date: '2024-11-19', status: 'present', branchId: 'b1' },
  { id: 'a3', studentId: 's3', date: '2024-11-19', status: 'present', branchId: 'b1' },
  { id: 'a4', studentId: 's4', date: '2024-11-19', status: 'present', branchId: 'b2' },
  { id: 'a5', studentId: 's5', date: '2024-11-19', status: 'present', branchId: 'b2' },
  { id: 'a6', studentId: 's6', date: '2024-11-19', status: 'absent', branchId: 'b3' },
];
