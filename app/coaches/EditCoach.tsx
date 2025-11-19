import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  coaches,
  batches,
  branches,
  students,
  Coach,
  Batch,
  Branch,
} from "../../lib/dummy-data";

/**
 * Helper: parse "6:00 AM - 7:30 AM" into {start: Date, end: Date}
 * Uses today's date for time objects.
 */
function parseTiming(timing: string) {
  // default to now
  const now = new Date();
  const [startStr = "", endStr = ""] = timing.split("-").map((s) => s.trim());
  const parsePart = (s: string) => {
    if (!s) return null;
    // try parse using Date.parse with appended today — but Date.parse may be locale dependent.
    // We'll parse "h:mm AM/PM" manually.
    const match = s.match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])/);
    if (!match) return null;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const ampm = match[3].toLowerCase();
    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    const d = new Date(now);
    d.setHours(hour, minute, 0, 0);
    return d;
  };
  return { start: parsePart(startStr), end: parsePart(endStr) };
}

function formatTimeRange(start?: Date | null, end?: Date | null) {
  if (!start || !end) return "";
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${start.toLocaleTimeString([], opts)} - ${end.toLocaleTimeString([], opts)}`;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function EditCoach() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [coach, setCoach] = useState<Coach | null>(null);

  // coach fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [salary, setSalary] = useState("");
  const [branchId, setBranchId] = useState("");

  // local copy of assigned batch states:
  // map batchId -> { start: Date | null, end: Date | null, showStart: boolean, showEnd: boolean, days: string[], branchId }
  const [assigned, setAssigned] = useState<Record<string, {
    start: Date | null;
    end: Date | null;
    showStart?: boolean;
    showEnd?: boolean;
    days: string[];
    branchId: string;
  }>>({});

  // list of assigned batch ids for this coach
  const [assignedBatchIds, setAssignedBatchIds] = useState<string[]>([]);

  // unassigned batches (coachId === null)
  const [unassignedBatchIds, setUnassignedBatchIds] = useState<string[]>([]);

  // load coach & batches
  useEffect(() => {
    if (!id) return;
    const coachObj = coaches.find((c) => c.id === id);
    if (!coachObj) {
      Alert.alert("Not found", "Coach not found");
      router.back();
      return;
    }

    setCoach(coachObj);
    setName(coachObj.name);
    setPhone(coachObj.phone);
    setEmail(coachObj.email);
    setExperience(String(coachObj.experience));
    setSpecialization(coachObj.specialization);
    setSalary(String(coachObj.salary));
    setBranchId(coachObj.branchId);

    // assigned batches
    const assignedBs = batches.filter((b) => b.coachId === coachObj.id);
    const assignedIds = assignedBs.map((b) => b.id);
    setAssignedBatchIds(assignedIds);

    // initialize assigned map
    const map: Record<string, any> = {};
    assignedBs.forEach((b) => {
      const parsed = parseTiming(b.timing);
      map[b.id] = {
        start: parsed.start,
        end: parsed.end,
        showStart: false,
        showEnd: false,
        days: [...b.days],
        branchId: b.branchId,
      };
    });
    setAssigned(map);

    // unassigned batches
    const unassigned = batches.filter((b) => b.coachId === null || b.coachId === undefined).map((b)=>b.id);
    setUnassignedBatchIds(unassigned);
  }, [id]);

  // handlers for picking times
  const openStartPicker = (batchId: string) => {
    setAssigned((prev) => ({
      ...prev,
      [batchId]: { ...(prev[batchId] || {}), showStart: true }
    }));
  };
  const openEndPicker = (batchId: string) => {
    setAssigned((prev) => ({
      ...prev,
      [batchId]: { ...(prev[batchId] || {}), showEnd: true }
    }));
  };

  const onTimeChange = (batchId: string, which: "start" | "end", event: any, selected?: Date | undefined) => {
    // For Android, event.type === 'dismissed' may indicate cancel
    const chosen = selected ?? undefined;
    setAssigned((prev) => {
      const cur = prev[batchId] || { start: null, end: null, days: [], branchId: "" };
      return {
        ...prev,
        [batchId]: {
          ...cur,
          start: which === "start" ? (chosen || cur.start) : cur.start,
          end: which === "end" ? (chosen || cur.end) : cur.end,
          showStart: false,
          showEnd: false,
        }
      };
    });
  };

  const toggleDay = (batchId: string, day: string) => {
    setAssigned((prev) => {
      const cur = prev[batchId] || { start: null, end: null, days: [], branchId: "" };
      const has = cur.days.includes(day);
      const daysNew = has ? cur.days.filter(d => d !== day) : [...cur.days, day];
      return { ...prev, [batchId]: { ...cur, days: daysNew } };
    });
  };

  const changeBatchBranch = (batchId: string, newBranchId: string) => {
    setAssigned((prev) => ({ ...prev, [batchId]: { ...(prev[batchId] || {}), branchId: newBranchId } }));
  };

  const unassignBatch = (batchId: string) => {
    // set coachId to null in global batches
    const idx = batches.findIndex(b => b.id === batchId);
    if (idx >= 0) {
      batches[idx].coachId = null;
    }
    // remove from assigned lists
    setAssignedBatchIds(prev => prev.filter(id => id !== batchId));
    setAssigned(prev => {
      const copy = { ...prev };
      delete copy[batchId];
      return copy;
    });
    // add to unassigned list
    setUnassignedBatchIds(prev => [batchId, ...prev]);
  };

  const assignBatch = (batchId: string) => {
    // set coachId to this coach in global batches
    const idx = batches.findIndex(b => b.id === batchId);
    if (idx >= 0 && coach) {
      batches[idx].coachId = coach.id;
      // initialize local assigned state for this batch
      const parsed = parseTiming(batches[idx].timing);
      setAssigned((prev) => ({
        ...prev,
        [batchId]: {
          start: parsed.start,
          end: parsed.end,
          showStart: false,
          showEnd: false,
          days: [...batches[idx].days],
          branchId: batches[idx].branchId,
        }
      }));
      setAssignedBatchIds(prev => [...prev, batchId]);
      setUnassignedBatchIds(prev => prev.filter(id => id !== batchId));
    }
  };

  const saveBatchEditsToGlobal = (batchId: string) => {
    const idx = batches.findIndex(b => b.id === batchId);
    if (idx < 0) return;
    const local = assigned[batchId];
    if (!local) return;
    // validation
    if (!local.start || !local.end) {
      Alert.alert("Invalid timing", "Please set both start and end time for the batch.");
      return;
    }
    if (local.start >= local.end) {
      Alert.alert("Invalid timing", "Start time should be before end time.");
      return;
    }
    // apply
    batches[idx].timing = formatTimeRange(local.start, local.end);
    batches[idx].days = [...local.days];
    batches[idx].branchId = local.branchId;
    Alert.alert("Saved", `Batch ${batches[idx].name} updated.`);
  };

  const saveAllChangesAndBack = () => {
    // Basic validation for coach fields
    if (!name.trim()) { Alert.alert("Validation", "Please enter coach name"); return; }
    if (!branchId) { Alert.alert("Validation", "Please select a branch"); return; }

    // update global coach object
    const cidx = coaches.findIndex(c => c.id === coach?.id);
    if (cidx >= 0 && coach) {
      coaches[cidx].name = name.trim();
      coaches[cidx].phone = phone.trim();
      coaches[cidx].email = email.trim();
      coaches[cidx].experience = Number(experience) || 0;
      coaches[cidx].specialization = specialization;
      coaches[cidx].salary = Number(salary) || 0;
      coaches[cidx].branchId = branchId;
    }

    // save each batch local edits to global
    assignedBatchIds.forEach(bId => {
      const local = assigned[bId];
      if (!local) return;
      const idx = batches.findIndex(b => b.id === bId);
      if (idx < 0) return;
      // require valid times
      if (!local.start || !local.end) return;
      batches[idx].timing = formatTimeRange(local.start, local.end);
      batches[idx].days = [...local.days];
      batches[idx].branchId = local.branchId;
      batches[idx].coachId = coach?.id ?? null;
    });

    Alert.alert("Success", "Coach updated successfully!");
    router.push("/coaches/CoachesTable");
  };

  if (!coach) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: "#fff", padding: 20 }}>Loading...</Text>
      </View>
    );
  }

  // derived helper lists
  const assignedBatches = assignedBatchIds.map(id => batches.find(b => b.id === id)!).filter(Boolean);
  const unassignedBatches = unassignedBatchIds.map(id => batches.find(b => b.id === id)!).filter(Boolean);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* small header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Coach</Text>
        </View>

        {/* Coach basic info */}
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Coach name" placeholderTextColor="#8b92b8" />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+91 ..." placeholderTextColor="#8b92b8" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@example.com" placeholderTextColor="#8b92b8" />

        <Text style={styles.label}>Experience (years)</Text>
        <TextInput style={styles.input} value={experience} onChangeText={setExperience} keyboardType="numeric" placeholder="e.g. 5" placeholderTextColor="#8b92b8" />

        <Text style={styles.label}>Specialization</Text>
        <TextInput style={styles.input} value={specialization} onChangeText={setSpecialization} placeholder="Beginners / Advanced" placeholderTextColor="#8b92b8" />

        <Text style={styles.label}>Salary</Text>
        <TextInput style={styles.input} value={salary} onChangeText={setSalary} keyboardType="numeric" placeholder="Salary" placeholderTextColor="#8b92b8" />

        <Text style={styles.label}>Coach Branch</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {branches.filter(b => b.id !== "all").map(b => (
            <TouchableOpacity
              key={b.id}
              style={[styles.branchChip, branchId === b.id && styles.branchChipActive]}
              onPress={() => setBranchId(b.id)}
            >
              <Text style={[styles.branchText, branchId === b.id && styles.branchTextActive]}>{b.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Assigned batches */}
        <Text style={[styles.label, { marginTop: 6 }]}>Assigned Batches</Text>
        {assignedBatches.length === 0 && <Text style={styles.subtext}>No batches assigned to this coach.</Text>}

        {assignedBatches.map(b => {
          const local = assigned[b.id];
          return (
            <View key={b.id} style={styles.batchCard}>
              <View style={styles.batchHeader}>
                <Text style={styles.batchTitle}>{b.name}</Text>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity style={styles.smallBtn} onPress={() => saveBatchEditsToGlobal(b.id)}>
                    <Text style={styles.smallBtnText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.smallBtn, { marginLeft: 8, backgroundColor: "#ff4444" }]} onPress={() => unassignBatch(b.id)}>
                    <Text style={[styles.smallBtnText, { color: "#fff" }]}>Unassign</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Timing row */}
              <View style={styles.timingRow}>
                <TouchableOpacity style={styles.timeBox} onPress={() => openStartPicker(b.id)}>
                  <Text style={styles.timeText}>{local?.start ? local.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Start"}</Text>
                </TouchableOpacity>

                <Text style={{ color: "#8b92b8", marginHorizontal: 8 }}>to</Text>

                <TouchableOpacity style={styles.timeBox} onPress={() => openEndPicker(b.id)}>
                  <Text style={styles.timeText}>{local?.end ? local.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "End"}</Text>
                </TouchableOpacity>
              </View>

              {/* DateTime pickers */}
              {local?.showStart && (
                <DateTimePicker
                  value={local.start || new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(e, d) => onTimeChange(b.id, "start", e, d)}
                />
              )}
              {local?.showEnd && (
                <DateTimePicker
                  value={local.end || new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(e, d) => onTimeChange(b.id, "end", e, d)}
                />
              )}

              {/* Days selector */}
              <View style={{ marginTop: 10 }}>
                <Text style={styles.smallLabel}>Days</Text>
                <View style={styles.daysRow}>
                  {WEEK_DAYS.map((d) => {
                    const active = local?.days?.includes(d);
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[styles.dayChip, active && styles.dayChipActive]}
                        onPress={() => toggleDay(b.id, d)}
                      >
                        <Text style={[styles.dayText, active && styles.dayTextActive]}>{d}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Branch selector for batch */}
              <View style={{ marginTop: 10 }}>
                <Text style={styles.smallLabel}>Branch</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {branches.filter(br => br.id !== "all").map(br => {
                    const active = local?.branchId === br.id;
                    return (
                      <TouchableOpacity
                        key={br.id}
                        style={[styles.branchChip, active && styles.branchChipActive]}
                        onPress={() => changeBatchBranch(b.id, br.id)}
                      >
                        <Text style={[styles.branchText, active && styles.branchTextActive]}>{br.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          );
        })}

        {/* Unassigned batches - add to coach */}
        <Text style={[styles.label, { marginTop: 8 }]}>Available Batches (unassigned)</Text>
        {unassignedBatches.length === 0 && <Text style={styles.subtext}>No unassigned batches available.</Text>}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {unassignedBatches.map(b => (
            <TouchableOpacity key={b.id} style={styles.unassignedChip} onPress={() => assignBatch(b.id)}>
              <Text style={styles.unassignedText}>{b.name}</Text>
              <Text style={styles.unassignedSub}>{b.timing}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Save all */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveAllChangesAndBack}>
          <Text style={styles.saveBtnText}>Save All & Back</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f1227",
  },
  container: {
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backIcon: { fontSize: 24, color: "#fff" },
  title: { fontSize: 22, fontWeight: "700", color: "#fff" },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    marginTop: 8,
  },
  subtext: { color: "#8b92b8", marginBottom: 8 },

  input: {
    backgroundColor: "#1a1f3a",
    padding: 14,
    borderRadius: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#2a2f4a",
    marginBottom: 8,
  },

  branchChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
  branchText: { color: "#8b92b8", fontWeight: "600" },
  branchTextActive: { color: "#0a0e27", fontWeight: "700" },

  batchCard: {
    backgroundColor: "#1a1f3a",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2f4a",
    marginBottom: 12,
  },
  batchHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  batchTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },

  smallBtn: {
    backgroundColor: "#00d4ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallBtnText: { color: "#0a0e27", fontWeight: "700" },

  timingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  timeBox: {
    backgroundColor: "#0f1630",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2f4a",
    minWidth: 110,
    alignItems: "center",
  },
  timeText: { color: "#8b92b8" },

  smallLabel: { color: "#8b92b8", marginBottom: 6 },

  daysRow: { flexDirection: "row", flexWrap: "wrap" },
  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#1a1f3a",
    borderWidth: 1,
    borderColor: "#2a2f4a",
  },
  dayChipActive: {
    backgroundColor: "#00d4ff",
    borderColor: "#00d4ff",
  },
  dayText: { color: "#8b92b8" },
  dayTextActive: { color: "#0a0e27", fontWeight: "700" },

  unassignedChip: {
    backgroundColor: "#0f1630",
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#2a2f4a",
    minWidth: 140,
  },
  unassignedText: { color: "#fff", fontWeight: "700" },
  unassignedSub: { color: "#8b92b8", marginTop: 6 },

  saveBtn: {
    backgroundColor: "#00d4ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnText: {
    color: "#0a0e27",
    fontWeight: "700",
    fontSize: 16,
  },
});
