import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import StudentCard from './StudentCard';
import { students, branches, Student } from '../../lib/dummy-data';
import { router } from "expo-router";



export default function StudentsTable() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'due' | 'partial'>('all');


  // Filter students based on branch, search, and fee status
  const filteredStudents = students.filter((student) => {
    const matchesBranch = selectedBranch === 'all' || student.branchId === selectedBranch;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || student.feeStatus === filterStatus;

    return matchesBranch && matchesSearch && matchesStatus;
  });

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown';
  };

  // Statistics
  const totalStudents = filteredStudents.length;
  const paidStudents = filteredStudents.filter(s => s.feeStatus === 'paid').length;
  const dueStudents = filteredStudents.filter(s => s.feeStatus === 'due').length;
  const partialStudents = filteredStudents.filter(s => s.feeStatus === 'partial').length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Students Management</Text>
        <Text style={styles.subtitle}>View and manage all students</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor="#8b92b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Branch Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Branch:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
        >
          {branches.map((branch) => (
            <TouchableOpacity
              key={branch.id}
              style={[
                styles.filterChip,
                selectedBranch === branch.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedBranch(branch.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedBranch === branch.id && styles.filterChipTextActive,
                ]}
              >
                {branch.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Fee Status Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Fee Status:</Text>
        <View style={styles.statusFilterRow}>
          <TouchableOpacity
            style={[
              styles.statusChip,
              filterStatus === 'all' && styles.statusChipActive,
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[styles.statusChipText, filterStatus === 'all' && styles.statusChipTextActive]}>
              All ({totalStudents})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusChip,
              filterStatus === 'paid' && styles.statusChipActivePaid,
            ]}
            onPress={() => setFilterStatus('paid')}
          >
            <Text style={[styles.statusChipText, filterStatus === 'paid' && styles.statusChipTextActive]}>
              Paid ({paidStudents})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusChip,
              filterStatus === 'due' && styles.statusChipActiveDue,
            ]}
            onPress={() => setFilterStatus('due')}
          >
            <Text style={[styles.statusChipText, filterStatus === 'due' && styles.statusChipTextActive]}>
              Due ({dueStudents})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusChip,
              filterStatus === 'partial' && styles.statusChipActivePartial,
            ]}
            onPress={() => setFilterStatus('partial')}
          >
            <Text style={[styles.statusChipText, filterStatus === 'partial' && styles.statusChipTextActive]}>
              Partial ({partialStudents})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalStudents}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, { borderColor: '#00ff88' }]}>
          <Text style={[styles.statValue, { color: '#00ff88' }]}>{paidStudents}</Text>
          <Text style={styles.statLabel}>Paid</Text>
        </View>
        <View style={[styles.statBox, { borderColor: '#ff4444' }]}>
          <Text style={[styles.statValue, { color: '#ff4444' }]}>{dueStudents}</Text>
          <Text style={styles.statLabel}>Due</Text>
        </View>
        <View style={[styles.statBox, { borderColor: '#ffaa00' }]}>
          <Text style={[styles.statValue, { color: '#ffaa00' }]}>{partialStudents}</Text>
          <Text style={styles.statLabel}>Partial</Text>
        </View>
      </View>

      {/* Students List */}
      <View style={styles.studentsListHeader}>
        <Text style={styles.studentsCount}>
          {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''} Found
        </Text>
      </View>

      <View style={styles.studentsList}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onPress={() => console.log('Student pressed:', student.name)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateText}>No students found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
          </View>
        )}
      </View>

      {/* Add Student Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/students/AddStudent")}
      >
        <Text style={styles.addButtonIcon}>➕</Text>
        <Text style={styles.addButtonText}>Add New Student</Text>
      </TouchableOpacity>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b92b8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  filterList: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a1f3a',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  filterChipActive: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  filterChipText: {
    color: '#8b92b8',
    fontWeight: '600',
    fontSize: 13,
  },
  filterChipTextActive: {
    color: '#0a0e27',
  },
  statusFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  statusChipActive: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  statusChipActivePaid: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88',
  },
  statusChipActiveDue: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  statusChipActivePartial: {
    backgroundColor: '#ffaa00',
    borderColor: '#ffaa00',
  },
  statusChipText: {
    color: '#8b92b8',
    fontWeight: '600',
    fontSize: 12,
  },
  statusChipTextActive: {
    color: '#0a0e27',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#8b92b8',
  },
  studentsListHeader: {
    marginBottom: 12,
  },
  studentsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  studentsList: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8b92b8',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  addButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a0e27',
  },
});