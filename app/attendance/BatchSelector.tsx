import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Batch } from '../../lib/dummy-data';

interface BatchSelectorProps {
  batches: Batch[];
  selectedBatch: Batch | null;
  onSelectBatch: (batch: Batch) => void;
}

export default function BatchSelector({ batches, selectedBatch, onSelectBatch }: BatchSelectorProps) {
  if (batches.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No batches available for this branch</Text>
      </View>
    );
  }

  return (
    <View style={styles.selectorSection}>
      <Text style={styles.sectionTitle}>Select Batch</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipList}>
        {batches.map((batch) => (
          <TouchableOpacity
            key={batch.id}
            style={[
              styles.chip,
              selectedBatch?.id === batch.id && styles.chipActive,
            ]}
            onPress={() => onSelectBatch(batch)}
          >
            <Text style={[
              styles.chipText,
              selectedBatch?.id === batch.id && styles.chipTextActive,
            ]}>
              {batch.name}
            </Text>
            <Text style={[
              styles.chipSubtext,
              selectedBatch?.id === batch.id && styles.chipSubtextActive,
            ]}>
              {batch.timing}
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
    minWidth: 140,
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
  chipSubtext: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 4,
  },
  chipSubtextActive: {
    color: '#0a0e27',
    opacity: 0.8,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8b92b8',
    fontSize: 14,
  },
});
