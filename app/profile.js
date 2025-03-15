import React from "react";
import { Image, Text, View, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Profile = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              source={require("../assets/images/images.jpeg")}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>John Doe</Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Full Name:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>John Michael Doe</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Email:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>john.doe@example.com</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>NIC:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>+1 (555) 123-4567</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Address:</Text>
              <View style={styles.detailBox}>
                {profile.isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={profile.address}
                    multiline
                    onChangeText={(text) => handleInputChange("address", text)}
                  />
                ) : (
                  <Text style={styles.detailValue}>{profile.address}</Text>
                )}
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Vehicle Details:</Text>
              <View style={styles.detailBox}>
                {profile.isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={profile.vehicle}
                    multiline
                    onChangeText={(text) => handleInputChange("vehicle", text)}
                  />
                ) : (
                  <Text style={styles.detailValue}>{profile.vehicle}</Text>
                )}
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>NIC Number:</Text>
              <View style={styles.detailBox}>
                {profile.isEditing ? (
                  <TextInput
                    style={styles.editableInput}
                    value={profile.nicNumber}
                    onChangeText={(text) => handleInputChange("nicNumber", text)}
                  />
                ) : (
                  <Text style={styles.detailValue}>{profile.nicNumber}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.navigationLinks}>
            <Link href="/review" asChild>
              <Text style={styles.reviewLink}>View Reviews</Text>
            </Link>
            <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
              <Text style={styles.editButtonText}>
                {profile.isEditing ? "Save" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E0E0E0",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  profileDetails: {
    width: "90%",
  },
  detailContainer: {
    width: "100%",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 20,
    fontWeight: "900",
    color: "#555",
    marginBottom: 5,
  },
  detailBox: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  detailValue: {
    fontSize: 18,
    color: "#333",
  },
  navigationLinks: {
    marginTop: 30,
    alignItems: "center",
  },
  reviewLink: {
    fontSize: 20,
    color: "#d32f2f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  editableInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    color: "#333",
  },
  editableName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    borderRadius: 5,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Profile;
