import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { branches, students } from "../../lib/dummy-data";

type TimeSlot = {
  id: string;
  start?: Date;
  end?: Date;
  showStart?: boolean;
  showEnd?: boolean;
};

export default function AddCoach() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  // map branchId -> array of TimeSlot
  const [branchSlots, setBranchSlots] = useState<Record<string, TimeSlot[]>>({});

  // helpers
  const toggleBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      // remove branch and its slots
      setSelectedBranches(selectedBranches.filter((b) => b !== branchId));
      const copy = { ...branchSlots };
      delete copy[branchId];
      setBranchSlots(copy);
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
      setBranchSlots({
        ...branchSlots,
        [branchId]: [
          {
            id: `${branchId}-slot-1`,
            start: undefined,
            end: undefined,
            showStart: false,
            showEnd: false,
          },
        ],
      });
    }
  };

  const addSlot = (branchId: string) => {
    const arr = branchSlots[branchId] || [];
    const newSlot: TimeSlot = {
      id: `${branchId}-slot-${arr.length + 1}-${Date.now()}`,
      start: undefined,
      end: undefined,
      showStart: false,
      showEnd: false,
    };
    setBranchSlots({ ...branchSlots, [branchId]: [...arr, newSlot] });
  };

  const removeSlot = (branchId: string, slotId: string) => {
    const arr = (branchSlots[branchId] || []).filter((s) => s.id !== slotId);
    setBranchSlots({ ...branchSlots, [branchId]: arr });
  };

  const showStartPicker = (branchId: string, slotId: string) => {
    const arr = (branchSlots[branchId] || []).map((s) =>
      s.id === slotId ? { ...s, showStart: true } : s
    );
    setBranchSlots({ ...branchSlots, [branchId]: arr });
  };

  const showEndPicker = (branchId: string, slotId: string) => {
    const arr = (branchSlots[branchId] || []).map((s) =>
      s.id === slotId ? { ...s, showEnd: true } : s
    );
    setBranchSlots({ ...branchSlots, [branchId]: arr });
  };

  const onChangeTime = (
    branchId: string,
    slotId: string,
    which: "start" | "end",
    event: any,
    selected?: Date | undefined
  ) => {
    // For Android, event.type === 'dismissed' may be used
    const arr = (branchSlots[branchId] || []).map((s) => {
      if (s.id !== slotId) return s;
      if (!selected) {
        // close pickers
        return { ...s, showStart: false, showEnd: false };
      }
      if (which === "start") {
        return { ...s, start: selected, showStart: false };
      } else {
        return { ...s, end: selected, showEnd: false };
      }
    });
    setBranchSlots({ ...branchSlots, [branchId]: arr });
  };

  // auto-calculated fields
  const totalBranches = selectedBranches.length;
  // students handled = number of students whose branchId in selectedBranches
  const studentsHandled = students.filter((s) => selectedBranches.includes(s.branchId)).length;

  const validateAndSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter coach name.");
      return;
    }
    if (!age || Number(age) <= 0) {
      Alert.alert("Validation", "Please enter a valid age.");
      return;
    }
    if (!mobile.trim()) {
      Alert.alert("Validation", "Please enter mobile number.");
      return;
    }
    if (!experience.trim()) {
      Alert.alert("Validation", "Please enter experience (years).");
      return;
    }
    if (!salary || Number(salary) <= 0) {
      Alert.alert("Validation", "Please enter a salary amount.");
      return;
    }
    if (selectedBranches.length === 0) {
      Alert.alert("Validation", "Please select at least one branch.");
      return;
    }

    // ensure each selected branch has at least one slot and slots have both start & end
    for (const bId of selectedBranches) {
      const slots = branchSlots[bId] || [];
      if (slots.length === 0) {
        Alert.alert("Validation", `Please add at least one time slot for ${getBranchName(bId)}.`);
        return;
      }
      for (const s of slots) {
        if (!s.start || !s.end) {
          Alert.alert("Validation", `Please set both start and end time for every slot in ${getBranchName(bId)}.`);
          return;
        }
        // optional: ensure start < end
        if (s.start >= s.end) {
          Alert.alert("Validation", `Start time must be before end time for ${getBranchName(bId)}.`);
          return;
        }
      }
    }

    // Build coach object (you can save this to storage / backend)
    const coach = {
      id: Date.now().toString(),
      name: name.trim(),
      age: Number(age),
      mobile: mobile.trim(),
      experience: experience.trim(),
      salary: Number(salary),
      branches: selectedBranches.map((bId) => ({
        id: bId,
        name: getBranchName(bId),
        slots: (branchSlots[bId] || []).map((s) => ({
          start: s.start?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          end: s.end?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        })),
      })),
      totalBranches,
      studentsHandled,
    };

    console.log("New Coach:", coach);
    Alert.alert("Success", "Coach added successfully!");

    // redirect to coaches table
    router.push("/coaches/CoachesTable");
  };

  const getBranchName = (id: string) => {
    const b = branches.find((x) => x.id === id);
    return b ? b.name : "Unknown";
  };

  // util to format time preview
  const formatTime = (d?: Date) =>
    d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select time";

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* back button */}
             <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Add Coach</Text>
        </View>



        {/* Basic fields */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter coach name"
          placeholderTextColor="#8b92b8"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          placeholderTextColor="#8b92b8"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile"
          placeholderTextColor="#8b92b8"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <Text style={styles.label}>Experience (years)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 3"
          placeholderTextColor="#8b92b8"
          keyboardType="numeric"
          value={experience}
          onChangeText={setExperience}
        />

        <Text style={styles.label}>Salary</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter salary amount"
          placeholderTextColor="#8b92b8"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
        />

        {/* Branch selection */}
        <Text style={styles.label}>Branches (select one or more)</Text>
        <View style={styles.branchRow}>
          {branches.map((b) => {
            const active = selectedBranches.includes(b.id);
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.branchChip, active && styles.branchChipActive]}
                onPress={() => toggleBranch(b.id)}
              >
                <Text style={[styles.branchText, active && styles.branchTextActive]}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* show per-branch time slots */}
        {selectedBranches.map((bId) => (
          <View key={bId} style={styles.branchSection}>
            <View style={styles.branchSectionHeader}>
              <Text style={styles.branchSectionTitle}>{getBranchName(bId)}</Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity style={styles.smallBtn} onPress={() => addSlot(bId)}>
                  <Text style={styles.smallBtnText}>+ Add Slot</Text>
                </TouchableOpacity>
              </View>
            </View>

            {(branchSlots[bId] || []).map((slot) => (
              <View key={slot.id} style={styles.slotRow}>
                <TouchableOpacity
                  style={styles.timeBox}
                  onPress={() => showStartPicker(bId, slot.id)}
                >
                  <Text style={styles.timeBoxText}>{formatTime(slot.start)}</Text>
                </TouchableOpacity>

                <Text style={{ marginHorizontal: 8, color: "#8b92b8" }}>to</Text>

                <TouchableOpacity
                  style={styles.timeBox}
                  onPress={() => showEndPicker(bId, slot.id)}
                >
                  <Text style={styles.timeBoxText}>{formatTime(slot.end)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeSlotBtn}
                  onPress={() => removeSlot(bId, slot.id)}
                >
                  <Text style={styles.removeSlotText}>✕</Text>
                </TouchableOpacity>

                {/* pickers (rendered for each slot when show flags set) */}
                {slot.showStart && (
                  <DateTimePicker
                    value={slot.start || new Date()}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, d) => onChangeTime(bId, slot.id, "start", e, d)}
                  />
                )}
                {slot.showEnd && (
                  <DateTimePicker
                    value={slot.end || new Date()}
                    mode="time"
                    is24Hour={false}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, d) => onChangeTime(bId, slot.id, "end", e, d)}
                  />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* auto-stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalBranches}</Text>
            <Text style={styles.statLabel}>Branches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{studentsHandled}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
        </View>

        {/* submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={validateAndSubmit}>
          <Text style={styles.submitText}>Create Coach</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f1227",
  },
  container: {
    padding: 20,
  },
  backButton: { marginBottom: 10 },
  backIcon: { fontSize: 28, color: "#fff" },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 18,
  },
    headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#1a1f3a",
    padding: 14,
    borderRadius: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#2a2f4a",
    marginBottom: 12,
  },

  branchRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    marginBottom: 16,
  },
  branchChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#1a1f3a",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#2a2f4a",
  },
  branchChipActive: {
    backgroundColor: "#00d4ff",
    borderColor: "#00d4ff",
  },
  branchText: {
    color: "#8b92b8",
    fontWeight: "600",
  },
  branchTextActive: {
    color: "#0a0e27",
  },

  branchSection: {
    marginBottom: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  branchSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  branchSectionTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  smallBtn: {
    backgroundColor: "#00d4ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallBtnText: {
    color: "#0a0e27",
    fontWeight: "700",
  },

  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeBox: {
    backgroundColor: "#1a1f3a",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2f4a",
    minWidth: 110,
    alignItems: "center",
  },
  timeBoxText: {
    color: "#8b92b8",
  },

  removeSlotBtn: {
    marginLeft: 10,
    backgroundColor: "#2a2f4a",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeSlotText: {
    color: "#fff",
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: "#1a1f3a",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2f4a",
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#00d4ff",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 4,
  },
  statLabel: {
    color: "#8b92b8",
    fontSize: 12,
  },

  submitBtn: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#00d4ff",
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0a0e27",
  },
});
