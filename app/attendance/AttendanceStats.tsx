import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Student, Attendance } from '../../lib/dummy-data';

interface AttendanceStatsProps {
  students: Student[];
  attendanceRecords: Attendance[];
}

export default function AttendanceStats({ students, attendanceRecords }: AttendanceStatsProps) {
  const present = attendanceRecords.filter(a => a.status === 'present').length;
  const absent = attendanceRecords.filter(a => a.status === 'absent').length;
  const leave = attendanceRecords.filter(a => a.status === 'leave').length;
  const total = students.length;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{total}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={[styles.statCard, styles.statCardPresent]}>
        <Text style={styles.statValue}>{present}</Text>
        <Text style={styles.statLabel}>Present</Text>
      </View>
      <View style={[styles.statCard, styles.statCardAbsent]}>
        <Text style={styles.statValue}>{absent}</Text>
        <Text style={styles.statLabel}>Absent</Text>
      </View>
      <View style={[styles.statCard, styles.statCardLeave]}>
        <Text style={styles.statValue}>{leave}</Text>
        <Text style={styles.statLabel}>Leave</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2f4a',
  },
  statCardPresent: {
    borderColor: '#00ff88',
  },
  statCardAbsent: {
    borderColor: '#ff4444',
  },
  statCardLeave: {
    borderColor: '#ffaa00',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#8b92b8',
  },
});