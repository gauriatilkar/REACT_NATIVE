import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import BranchSelector from './BranchSelector';
import BatchSelector from './BatchSelector';
import DateSelector from './DateSelector';
import AttendanceStats from './AttendanceStats';
import StudentAttendanceCard from './StudentAttendanceCard';
import ViewToggle from './ViewTogggle';
import MonthlyAttendanceView from './MonthlyAttendance';
import YearlyAttendanceView from './AttendanceView';
import { branches, batches, students, Branch, Batch, Attendance } from '../../lib/dummy-data';

export default function AttendancePage() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentView, setCurrentView] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  // Get batches for selected branch
  const branchBatches = selectedBranch 
    ? batches.filter(b => b.branchId === selectedBranch.id)
    : [];

  // Get students for selected batch
  const batchStudents = selectedBatch
    ? students.filter(s => s.batchId === selectedBatch.id)
    : [];

  // Handle marking attendance
  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'leave') => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingIndex = attendanceRecords.findIndex(
      a => a.studentId === studentId && a.date === dateStr
    );

    if (existingIndex >= 0) {
      const updated = [...attendanceRecords];
      updated[existingIndex] = { ...updated[existingIndex], status };
      setAttendanceRecords(updated);
    } else {
      const newRecord: Attendance = {
        id: `a${Date.now()}${studentId}`,
        studentId,
        date: dateStr,
        status,
        branchId: selectedBranch!.id,
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  // Get attendance status for a student
  const getAttendanceStatus = (studentId: string): 'present' | 'absent' | 'leave' | null => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const record = attendanceRecords.find(
      a => a.studentId === studentId && a.date === dateStr
    );
    return record?.status || null;
  };

  // Save attendance
  const handleSaveAttendance = () => {
    // Here you would save to your backend/database
    console.log('Saving attendance:', attendanceRecords);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Mark all as present/absent
  const markAllAs = (status: 'present' | 'absent' | 'leave') => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const newRecords: Attendance[] = batchStudents.map(student => ({
      id: `a${Date.now()}${student.id}`,
      studentId: student.id,
      date: dateStr,
      status,
      branchId: selectedBranch!.id,
    }));
    setAttendanceRecords(newRecords);
  };

  // Month/Year navigation
  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const changeYear = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setSelectedDate(newDate);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Management</Text>
        <Text style={styles.subtitle}>Track and view student attendance</Text>
      </View>

      {/* View Toggle */}
      <ViewToggle currentView={currentView} onChangeView={setCurrentView} />

      {/* Branch Selector */}
      <BranchSelector
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={(branch) => {
          setSelectedBranch(branch);
          setSelectedBatch(null);
          setAttendanceRecords([]);
        }}
      />

      {/* Batch Selector */}
      {selectedBranch && (
        <BatchSelector
          batches={branchBatches}
          selectedBatch={selectedBatch}
          onSelectBatch={(batch) => {
            setSelectedBatch(batch);
            setAttendanceRecords([]);
          }}
        />
      )}

      {/* Date/Month/Year Selector based on view */}
      {selectedBatch && currentView === 'daily' && (
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      )}

      {selectedBatch && currentView === 'monthly' && (
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={styles.periodButton}
            onPress={() => changeMonth(-1)}
          >
            <Text style={styles.periodButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.periodCurrent}>
            <Text style={styles.periodText}>
              {selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.periodButton}
            onPress={() => changeMonth(1)}
          >
            <Text style={styles.periodButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedBatch && currentView === 'yearly' && (
        <View style={styles.periodSelector}>
          <TouchableOpacity 
            style={styles.periodButton}
            onPress={() => changeYear(-1)}
          >
            <Text style={styles.periodButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.periodCurrent}>
            <Text style={styles.periodText}>{selectedDate.getFullYear()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.periodButton}
            onPress={() => changeYear(1)}
          >
            <Text style={styles.periodButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Daily View - Mark Attendance */}
      {selectedBatch && batchStudents.length > 0 && currentView === 'daily' && (
        <>
          {/* Attendance Stats */}
          <AttendanceStats
            students={batchStudents}
            attendanceRecords={attendanceRecords.filter(
              a => a.date === selectedDate.toISOString().split('T')[0]
            )}
          />

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => markAllAs('present')}
            >
              <Text style={styles.quickButtonText}>Mark All Present</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickButton, styles.quickButtonSecondary]}
              onPress={() => markAllAs('absent')}
            >
              <Text style={[styles.quickButtonText, styles.quickButtonTextSecondary]}>
                Mark All Absent
              </Text>
            </TouchableOpacity>
          </View>

          {/* Student List */}
          <View style={styles.studentsList}>
            <Text style={styles.sectionTitle}>
              Students ({batchStudents.length})
            </Text>
            {batchStudents.map((student) => (
              <StudentAttendanceCard
                key={student.id}
                student={student}
                attendanceStatus={getAttendanceStatus(student.id)}
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveAttendance}
          >
            <Text style={styles.saveButtonText}>💾 Save Attendance</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Monthly View */}
      {selectedBatch && batchStudents.length > 0 && currentView === 'monthly' && (
        <MonthlyAttendanceView
          students={batchStudents}
          attendanceRecords={attendanceRecords}
          selectedMonth={selectedDate}
        />
      )}

      {/* Yearly View */}
      {selectedBatch && batchStudents.length > 0 && currentView === 'yearly' && (
        <YearlyAttendanceView
          students={batchStudents}
          attendanceRecords={attendanceRecords}
          selectedYear={selectedDate.getFullYear()}
        />
      )}

      {/* Empty State */}
      {!selectedBranch && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Select a branch to begin</Text>
          <Text style={styles.emptySubtext}>
            Choose a branch, then select a batch to mark attendance
          </Text>
        </View>
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>Attendance Saved!</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b92b8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#00d4ff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickButtonSecondary: {
    backgroundColor: '#1a1f3a',
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  quickButtonText: {
    color: '#0a0e27',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickButtonTextSecondary: {
    color: '#ff4444',
  },
  studentsList: {
    marginBottom: 24,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1f3a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  periodButton: {
    width: 44,
    height: 44,
    backgroundColor: '#0a0e27',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodButtonText: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  periodCurrent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  periodText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#00ff88',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#0a0e27',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8b92b8',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModal: {
    backgroundColor: '#1a1f3a',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  successIcon: {
    fontSize: 48,
    color: '#00ff88',
    marginBottom: 12,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});