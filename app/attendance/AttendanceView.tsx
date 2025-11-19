import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Student, Attendance } from '../../lib/dummy-data';

interface YearlyAttendanceViewProps {
  students: Student[];
  attendanceRecords: Attendance[];
  selectedYear: number;
}

export default function YearlyAttendanceView({ 
  students, 
  attendanceRecords, 
  selectedYear 
}: YearlyAttendanceViewProps) {
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getAttendanceForStudentMonth = (studentId: string, monthIndex: number) => {
    const year = selectedYear;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    let presentDays = 0;
    let totalMarked = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = attendanceRecords.find(
        a => a.studentId === studentId && a.date === dateStr
      );
      
      if (record) {
        totalMarked++;
        if (record.status === 'present') presentDays++;
      }
    }

    return totalMarked > 0 ? ((presentDays / totalMarked) * 100).toFixed(0) : '-';
  };

  const getYearlyStats = (studentId: string) => {
    const yearRecords = attendanceRecords.filter(a => {
      const recordYear = new Date(a.date).getFullYear();
      return a.studentId === studentId && recordYear === selectedYear;
    });

    const present = yearRecords.filter(a => a.status === 'present').length;
    const absent = yearRecords.filter(a => a.status === 'absent').length;
    const leave = yearRecords.filter(a => a.status === 'leave').length;
    const total = yearRecords.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';

    return { present, absent, leave, total, percentage };
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.yearTitle}>📊 Year {selectedYear}</Text>

      {students.map((student) => {
        const yearStats = getYearlyStats(student.id);
        return (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentMeta}>
                  {yearStats.total} days marked • {yearStats.percentage}% attendance
                </Text>
              </View>
            </View>

            <View style={styles.yearStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{yearStats.present}</Text>
                <Text style={[styles.statLabel, { color: '#00ff88' }]}>Present</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{yearStats.absent}</Text>
                <Text style={[styles.statLabel, { color: '#ff4444' }]}>Absent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{yearStats.leave}</Text>
                <Text style={[styles.statLabel, { color: '#ffaa00' }]}>Leave</Text>
              </View>
            </View>

            <Text style={styles.monthsTitle}>Monthly Breakdown</Text>
            <View style={styles.monthsGrid}>
              {months.map((month, index) => {
                const percentage = getAttendanceForStudentMonth(student.id, index);
                return (
                  <View key={month} style={styles.monthCell}>
                    <Text style={styles.monthName}>{month}</Text>
                    <Text style={[
                      styles.monthPercentage,
                      percentage !== '-' && parseFloat(percentage) >= 75 && { color: '#00ff88' },
                      percentage !== '-' && parseFloat(percentage) < 75 && parseFloat(percentage) >= 50 && { color: '#ffaa00' },
                      percentage !== '-' && parseFloat(percentage) < 50 && { color: '#ff4444' },
                    ]}>
                      {percentage === '-' ? '-' : `${percentage}%`}
                    </Text>
                  </View>
                );
              })}
            </View>
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
  yearTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  studentCard: {
    backgroundColor: '#1a1f3a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00d4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#0a0e27',
    fontSize: 20,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  studentMeta: {
    fontSize: 12,
    color: '#8b92b8',
  },
  yearStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0e27',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  monthsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b92b8',
    marginBottom: 12,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCell: {
    width: '22%',
    backgroundColor: '#0a0e27',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  monthName: {
    fontSize: 11,
    color: '#8b92b8',
    marginBottom: 4,
  },
  monthPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
