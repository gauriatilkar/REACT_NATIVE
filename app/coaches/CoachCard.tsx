import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Coach, branches, students, batches } from "../../lib/dummy-data";

interface Props {
  coach: Coach;
  onEdit?: () => void;
}

export default function CoachCard({ coach, onEdit }: Props) {
  const branch = branches.find(b => b.id === coach.branchId);

  const coachedStudents = students.filter(s => s.branchId === coach.branchId);
  const coachBatches = batches.filter(b => b.coachId === coach.id);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{coach.name.charAt(0)}</Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.name}>{coach.name}</Text>
          <Text style={styles.detail}>
            {coach.experience} yrs exp • {coach.specialization}
          </Text>
          <Text style={styles.detail}>{branch?.name}</Text>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Text style={styles.editText}>✎ Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Students</Text>
          <Text style={styles.infoValue}>{coachedStudents.length}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Batches</Text>
          <Text style={styles.infoValue}>{coachBatches.length}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Salary</Text>
          <Text style={[styles.infoValue, { color: "#00d4ff" }]}>
            ₹{coach.salary}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>📞 {coach.phone}</Text>
        <Text style={styles.footerText}>✉️ {coach.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1f3a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2a2f4a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#00d4ff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0a0e27",
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  detail: {
    fontSize: 12,
    color: "#8b92b8",
  },
  editBtn: {
    backgroundColor: "#00d4ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: "#0a0e27",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#2a2f4a",
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    color: "#8b92b8",
    fontSize: 12,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2f4a",
    paddingTop: 10,
  },
  footerText: {
    color: "#8b92b8",
    fontSize: 12,
  },
});
