import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Student } from '../../lib/dummy-data';

interface StudentAttendanceCardProps {
  student: Student;
  attendanceStatus: 'present' | 'absent' | 'leave' | null;
  onMarkAttendance: (studentId: string, status: 'present' | 'absent' | 'leave') => void;
}

export default function StudentAttendanceCard({ 
  student, 
  attendanceStatus, 
  onMarkAttendance 
}: StudentAttendanceCardProps) {
  return (
    <View style={styles.studentCard}>
      <View style={styles.studentInfo}>
        <View style={styles.studentAvatar}>
          <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentMeta}>Age: {student.age} • {student.phone}</Text>
        </View>
      </View>

      <View style={styles.attendanceActions}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            attendanceStatus === 'present' && styles.statusButtonPresent,
          ]}
          onPress={() => onMarkAttendance(student.id, 'present')}
        >
          <Text style={[
            styles.statusButtonText,
            attendanceStatus === 'present' && styles.statusButtonTextActive,
          ]}>
            ✓
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusButton,
            attendanceStatus === 'absent' && styles.statusButtonAbsent,
          ]}
          onPress={() => onMarkAttendance(student.id, 'absent')}
        >
          <Text style={[
            styles.statusButtonText,
            attendanceStatus === 'absent' && styles.statusButtonTextActive,
          ]}>
            ✗
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statusButton,
            attendanceStatus === 'leave' && styles.statusButtonLeave,
          ]}
          onPress={() => onMarkAttendance(student.id, 'leave')}
        >
          <Text style={[
            styles.statusButtonText,
            attendanceStatus === 'leave' && styles.statusButtonTextActive,
          ]}>
            L
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  studentCard: {
    backgroundColor: '#1a1f3a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2f4a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
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
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  studentMeta: {
    fontSize: 12,
    color: '#8b92b8',
  },
  attendanceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 44,
    height: 44,
    backgroundColor: '#0a0e27',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2a2f4a',
  },
  statusButtonPresent: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88',
  },
  statusButtonAbsent: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  statusButtonLeave: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffaa00',
  },
  statusButtonText: {
    color: '#8b92b8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusButtonTextActive: {
    color: '#0a0e27',
  },
});