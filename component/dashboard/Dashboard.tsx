import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import StatCard from './StatCard';
import { Branch, branches } from '../../lib/dummy-data';

export default function Dashboard() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.welcomeSubtext}>
          Here's what's happening with your academy today
        </Text>
      </View>

      {/* Branch Selector */}
      <View style={styles.branchSelector}>
        <Text style={styles.sectionTitle}>Select Branch</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.branchList}
        >
          {branches.map((branch) => (
            <TouchableOpacity
              key={branch.id}
              style={[
                styles.branchChip,
                selectedBranch.id === branch.id && styles.branchChipActive,
              ]}
              onPress={() => setSelectedBranch(branch)}
            >
              <Text
                style={[
                  styles.branchChipText,
                  selectedBranch.id === branch.id && styles.branchChipTextActive,
                ]}
              >
                {branch.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="👥"
          value={selectedBranch.totalStudents}
          label="Total Students"
        />
        <StatCard
          icon="✅"
          value={selectedBranch.presentToday}
          label="Present Today"
        />
        <StatCard
          icon="💰"
          value={`₹${(selectedBranch.revenue / 1000).toFixed(0)}k`}
          label="This Month"
        />
        <StatCard
          icon="👨‍🏫"
          value={selectedBranch.coaches}
          label="Coaches"
        />
      </View>

      {/* Branch Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>{selectedBranch.name}</Text>
        <Text style={styles.detailsLocation}>📍 {selectedBranch.location}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Attendance Rate</Text>
            <Text style={styles.detailValue}>
              {((selectedBranch.presentToday / selectedBranch.totalStudents) * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Revenue</Text>
            <Text style={styles.detailValue}>₹{selectedBranch.revenue.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>➕</Text>
            <Text style={styles.actionButtonText}>Add Student</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>✓</Text>
            <Text style={styles.actionButtonText}>Mark Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>💳</Text>
            <Text style={styles.actionButtonText}>Collect Fee</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>📅</Text>
            <Text style={styles.actionButtonText}>Schedule Class</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#8b92b8',
  },
  branchSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  branchList: {
    flexDirection: 'row',
  },
  branchChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1f3a',
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  branchChipActive: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  branchChipText: {
    color: '#8b92b8',
    fontWeight: '600',
    fontSize: 14,
  },
  branchChipTextActive: {
    color: '#0a0e27',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  detailsCard: {
    backgroundColor: '#1a1f3a',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2f4a',
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detailsLocation: {
    fontSize: 14,
    color: '#8b92b8',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8b92b8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1f3a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2f4a',
    alignItems: 'center',
  },
  actionButtonIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#8b92b8',
    textAlign: 'center',
  },
});