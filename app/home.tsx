import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';
import Dashboard from '../component/dashboard/Dashboard';
import StudentsTable from './students/StudentsTable';
import CoachesTable from './coaches/CoachesTable';
import AttendancePage from './attendance/AttendancePage';

export default function HomeScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');

  const handleMenuPress = (itemName: string) => {
    setActiveSection(itemName);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Students':
        return <StudentsTable />;
      case 'Attendance':
        return <AttendancePage />; // Replace with AttendanceTable when created
      case 'Fees':
        return <Dashboard />; // Replace with FeesTable when created
      case 'Coaches':
        return <CoachesTable />; // Replace with CoachesTable when created
      case 'Batches':
        return <Dashboard />; // Replace with BatchesTable when created
      case 'Branches':
        return <Dashboard />; // Replace with BranchesTable when created
      case 'Reports':
        return <Dashboard />; // Replace with Reports when created
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <Header onMenuPress={() => setSidebarOpen(!sidebarOpen)} />

        <View style={styles.mainContent}>
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            activeSection={activeSection}
            onClose={() => setSidebarOpen(false)}
            onMenuPress={handleMenuPress}
          />

          {/* Main Content Area */}
          {renderContent()}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
});