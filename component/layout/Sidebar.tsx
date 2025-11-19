import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface SidebarProps {
  isOpen: boolean;
  activeSection: string;
  onClose: () => void;
  onMenuPress: (itemName: string) => void;
}

const menuItems = [
  { id: 1, name: 'Dashboard', icon: '📊' },
  { id: 2, name: 'Attendance', icon: '✅' },
  { id: 3, name: 'Fees', icon: '💰' },
  { id: 4, name: 'Coaches', icon: '👨‍🏫' },
  { id: 5, name: 'Batches', icon: '👥' },
  { id: 6, name: 'Students', icon: '🏃' },
  { id: 7, name: 'Branches', icon: '🏢' },
  { id: 8, name: 'Reports', icon: '📈' },
];

export default function Sidebar({ isOpen, activeSection, onClose, onMenuPress }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Sidebar Content */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🏸</Text>
          </View>
          <Text style={styles.sidebarTitle}>OnFit Pro</Text>
          <Text style={styles.sidebarSubtitle}>Admin Panel</Text>
        </View>

        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                activeSection === item.name && styles.activeMenuItem,
              ]}
              onPress={() => onMenuPress(item.name)}
            >
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.menuItemText,
                  activeSection === item.name && styles.activeMenuItemText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#1a1f3a',
    borderRightWidth: 1,
    borderRightColor: '#2a2f4a',
    zIndex: 2,
  },
  sidebarHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2f4a',
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#00d4ff',
  },
  logoIcon: {
    fontSize: 30,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sidebarSubtitle: {
    fontSize: 12,
    color: '#8b92b8',
  },
  menuList: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: '#00d4ff',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#8b92b8',
    fontWeight: '500',
  },
  activeMenuItemText: {
    color: '#0a0e27',
    fontWeight: '700',
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2f4a',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#2a2f4a',
    borderRadius: 8,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});