import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ViewToggleProps {
  currentView: 'daily' | 'monthly' | 'yearly';
  onChangeView: (view: 'daily' | 'monthly' | 'yearly') => void;
}

export default function ViewToggle({ currentView, onChangeView }: ViewToggleProps) {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, currentView === 'daily' && styles.toggleButtonActive]}
        onPress={() => onChangeView('daily')}
      >
        <Text style={[styles.toggleText, currentView === 'daily' && styles.toggleTextActive]}>
          Daily
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, currentView === 'monthly' && styles.toggleButtonActive]}
        onPress={() => onChangeView('monthly')}
      >
        <Text style={[styles.toggleText, currentView === 'monthly' && styles.toggleTextActive]}>
          Monthly
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, currentView === 'yearly' && styles.toggleButtonActive]}
        onPress={() => onChangeView('yearly')}
      >
        <Text style={[styles.toggleText, currentView === 'yearly' && styles.toggleTextActive]}>
          Yearly
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#00d4ff',
  },
  toggleText: {
    color: '#8b92b8',
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#0a0e27',
  },
});
