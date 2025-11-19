import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Student } from '../../lib/dummy-data';

interface StudentCardProps {
  student: Student;
  onPress?: () => void;
}

export default function StudentCard({ student, onPress }: StudentCardProps) {
  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#00ff88';
      case 'due':
        return '#ff4444';
      case 'partial':
        return '#ffaa00';
      default:
        return '#8b92b8';
    }
  };

  const getFeeStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'due':
        return 'Due';
      case 'partial':
        return 'Partial';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.detail}>Age: {student.age} years</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getFeeStatusColor(student.feeStatus) }]}>
          <Text style={styles.badgeText}>{getFeeStatusText(student.feeStatus)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Joining Date</Text>
          <Text style={styles.infoValue}>
            {new Date(student.joiningDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Attendance</Text>
          <Text style={styles.infoValue}>{student.attendancePercentage}%</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Fee Amount</Text>
          <Text style={styles.infoValue}>₹{student.feeAmount}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Fee Paid</Text>
          <Text style={[styles.infoValue, { color: getFeeStatusColor(student.feeStatus) }]}>
            ₹{student.feePaid}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>📞 {student.phone}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a0e27',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  detail: {
    fontSize: 12,
    color: '#8b92b8',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0a0e27',
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2f4a',
    marginVertical: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#8b92b8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2f4a',
  },
  footerText: {
    fontSize: 12,
    color: '#8b92b8',
  },
});