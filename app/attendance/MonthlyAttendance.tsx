import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Student, Attendance } from '../../lib/dummy-data';

interface MonthlyAttendanceViewProps {
  students: Student[];
  attendanceRecords: Attendance[];
  selectedMonth: Date;
}

export default function MonthlyAttendanceView({ 
  students, 
  attendanceRecords, 
  selectedMonth 
}: MonthlyAttendanceViewProps) {
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getAttendanceForStudent = (studentId: string) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const daysInMonth = getDaysInMonth(selectedMonth);
    
    let presentDays = 0;
    let absentDays = 0;
    let leaveDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = attendanceRecords.find(
        a => a.studentId === studentId && a.date === dateStr
      );
      
      if (record?.status === 'present') presentDays++;
      else if (record?.status === 'absent') absentDays++;
      else if (record?.status === 'leave') leaveDays++;
    }

    const totalMarked = presentDays + absentDays + leaveDays;
    const attendancePercentage = totalMarked > 0 
      ? ((presentDays / totalMarked) * 100).toFixed(1)
      : '0.0';

    return { presentDays, absentDays, leaveDays, attendancePercentage, totalMarked };
  };

  const monthName = selectedMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.monthTitle}>📅 {monthName}</Text>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.nameCell]}>Student</Text>
        <Text style={styles.headerCell}>Present</Text>
        <Text style={styles.headerCell}>Absent</Text>
        <Text style={styles.headerCell}>Leave</Text>
        <Text style={styles.headerCell}>%</Text>
      </View>

      {students.map((student) => {
        const stats = getAttendanceForStudent(student.id);
        return (
          <View key={student.id} style={styles.tableRow}>
            <View style={[styles.cell, styles.nameCell]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentAge}>Age {student.age}</Text>
              </View>
            </View>
            <Text style={[styles.cell, styles.presentCell]}>{stats.presentDays}</Text>
            <Text style={[styles.cell, styles.absentCell]}>{stats.absentDays}</Text>
            <Text style={[styles.cell, styles.leaveCell]}>{stats.leaveDays}</Text>
            <Text style={[styles.cell, styles.percentCell]}>{stats.attendancePercentage}%</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1f3a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  headerCell: {
    flex: 1,
    color: '#8b92b8',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  nameCell: {
    flex: 2,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1f3a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  cell: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00d4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#0a0e27',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  studentAge: {
    color: '#8b92b8',
    fontSize: 11,
  },
  presentCell: {
    color: '#00ff88',
  },
  absentCell: {
    color: '#ff4444',
  },
  leaveCell: {
    color: '#ffaa00',
  },
  percentCell: {
    color: '#00d4ff',
  },
});
