import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Branch } from '../../lib/dummy-data';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
}

export default function BranchSelector({ branches, selectedBranch, onSelectBranch }: BranchSelectorProps) {
  return (
    <View style={styles.selectorSection}>
      <Text style={styles.sectionTitle}>Select Branch</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipList}>
        {branches.filter(b => b.id !== 'all').map((branch) => (
          <TouchableOpacity
            key={branch.id}
            style={[
              styles.chip,
              selectedBranch?.id === branch.id && styles.chipActive,
            ]}
            onPress={() => onSelectBranch(branch)}
          >
            <Text style={[
              styles.chipText,
              selectedBranch?.id === branch.id && styles.chipTextActive,
            ]}>
              {branch.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  chipList: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2a2f4a',
    minWidth: 100,
  },
  chipActive: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  chipText: {
    color: '#8b92b8',
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#0a0e27',
  },
});