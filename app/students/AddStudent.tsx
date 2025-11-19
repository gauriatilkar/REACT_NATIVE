import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { branches } from "../../lib/dummy-data";

export default function AddStudent() {
  const [studentName, setStudentName] = useState("");
  const [branch, setBranch] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [dob, setDob] = useState("");
  const [fees, setFees] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");

  const [coachName, setCoachName] = useState("");
  const [batchTiming, setBatchTiming] = useState("");

  // Date pickers
  const [showJoiningPicker, setShowJoiningPicker] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const handleSubmit = () => {
    if (
      !studentName ||
      !branch ||
      !joiningDate ||
      !fees ||
      !mobile ||
      !dob ||
      !age ||
      !coachName ||
      !batchTiming
    ) {
      alert("Please fill all fields");
      return;
    }

    alert("Student added successfully!");
    router.push("/students/StudentsTable");
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Back + Title Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Add New Student</Text>
        </View>

        {/* Student Name */}
        <Text style={styles.label}>Student Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter student name"
          placeholderTextColor="#8b92b8"
          value={studentName}
          onChangeText={setStudentName}
        />

        {/* Branch */}
        <Text style={styles.label}>Select Branch</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.branchRow}>
          {branches.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[
                styles.branchChip,
                branch === b.id && styles.branchChipActive,
              ]}
              onPress={() => setBranch(b.id)}
            >
              <Text
                style={[
                  styles.branchText,
                  branch === b.id && styles.branchTextActive,
                ]}
              >
                {b.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Joining Date */}
        <Text style={styles.label}>Joining Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowJoiningPicker(true)}>
          <Text style={styles.dateText}>
            {joiningDate || "Select Joining Date"}
          </Text>
        </TouchableOpacity>

        {showJoiningPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowJoiningPicker(false);
              if (selectedDate) setJoiningDate(selectedDate.toISOString().split("T")[0]);
            }}
          />
        )}

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDobPicker(true)}>
          <Text style={styles.dateText}>
            {dob || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>

        {showDobPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowDobPicker(false);
              if (selectedDate) setDob(selectedDate.toISOString().split("T")[0]);
            }}
          />
        )}

        {/* Fees */}
        <Text style={styles.label}>Fees</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter fees"
          placeholderTextColor="#8b92b8"
          keyboardType="numeric"
          value={fees}
          onChangeText={setFees}
        />

        {/* Coach Name */}
        <Text style={styles.label}>Coach Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Coach Name"
          placeholderTextColor="#8b92b8"
          value={coachName}
          onChangeText={setCoachName}
        />

        {/* Batch Timing */}
        <Text style={styles.label}>Batch Timing</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter batch timing (e.g. 7–8 AM)"
          placeholderTextColor="#8b92b8"
          value={batchTiming}
          onChangeText={setBatchTiming}
        />

        {/* Mobile */}
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#8b92b8"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          placeholderTextColor="#8b92b8"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 25,
  },

  backIcon: {
    fontSize: 28,
    color: "#fff",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
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
    padding: 16,
    borderRadius: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#2a2f4a",
    marginBottom: 16,
  },

  dateText: {
    color: "#8b92b8",
    fontSize: 15,
  },

  branchRow: {
    marginBottom: 16,
    flexDirection: "row",
  },

  branchChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
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

  submitBtn: {
    marginTop: 20,
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
