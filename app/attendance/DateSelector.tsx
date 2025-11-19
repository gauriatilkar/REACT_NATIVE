import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onSelectDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <View style={styles.dateSelector}>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => changeDate(-1)}
      >
        <Text style={styles.dateButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.dateCurrent}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        {isToday && <Text style={styles.todayBadge}>Today</Text>}
      </View>

      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => changeDate(1)}
      >
        <Text style={styles.dateButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  dateSelector: {
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
  dateButton: {
    width: 44,
    height: 44,
    backgroundColor: '#0a0e27',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateCurrent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  todayBadge: {
    backgroundColor: '#00d4ff',
    color: '#0a0e27',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
});