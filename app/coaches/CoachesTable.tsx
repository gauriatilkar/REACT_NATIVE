import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { coaches, branches } from "../../lib/dummy-data";
import CoachCard from "./CoachCard";

export default function CoachesTable() {
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [list, setList] = useState([...coaches]); // local state to trigger refresh

  // Auto-refresh when returning from EditCoach
  useFocusEffect(() => {
    setList([...coaches]); // refresh list when screen re-focuses
  });

  // Filter coaches
  const filteredCoaches = list.filter((c) => {
    const matchBranch =
      selectedBranch === "all" || c.branchId === selectedBranch;

    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);

    return matchBranch && matchSearch;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Text style={styles.title}>Coaches Management</Text>
      <Text style={styles.subtitle}>View & Manage All Coaches</Text>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search coach by name or phone..."
          placeholderTextColor="#8b92b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Branch Filter */}
      <Text style={styles.filterLabel}>Filter By Branch</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {branches.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[
              styles.chip,
              selectedBranch === b.id && styles.chipActive,
            ]}
            onPress={() => setSelectedBranch(b.id)}
          >
            <Text
              style={[
                styles.chipText,
                selectedBranch === b.id && styles.chipTextActive,
              ]}
            >
              {b.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <Text style={styles.count}>
        {filteredCoaches.length} Coach
        {filteredCoaches.length !== 1 ? "es" : ""} Found
      </Text>

      {/* Coach List */}
      {filteredCoaches.map((coach) => (
        <CoachCard
          key={coach.id}
          coach={coach}
          onEdit={() => router.push(`/coaches/EditCoach?id=${coach.id}`)}
        />
      ))}

      {/* Add Coach Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/coaches/AddCoach")}
      >
        <Text style={styles.addIcon}>➕</Text>
        <Text style={styles.addText}>Add New Coach</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#0f1227" },

  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#8b92b8", marginBottom: 15 },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#1a1f3a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2f4a",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchIcon: { fontSize: 18, marginRight: 8, color: "#fff" },
  searchInput: { flex: 1, color: "#fff", paddingVertical: 12 },

  filterLabel: {
    color: "#fff",
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "700",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#1a1f3a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a2f4a",
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: "#00d4ff",
    borderColor: "#00d4ff",
  },
  chipText: { color: "#8b92b8" },
  chipTextActive: { color: "#0a0e27", fontWeight: "700" },

  count: {
    color: "#fff",
    marginVertical: 12,
    fontWeight: "700",
  },

  addBtn: {
    backgroundColor: "#00d4ff",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  addIcon: { marginRight: 8, color: "#0a0e27", fontWeight: "900" },
  addText: { color: "#0a0e27", fontWeight: "700", fontSize: 16 },
});
