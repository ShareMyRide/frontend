import React, { useState } from "react";
import { Pressable, Text, View, Modal, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const Dashboard = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={toggleMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={30} color="#333" />
            </Pressable>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Dashboard</Text>
            </View>
          </View>

          <Text style={styles.instructionText}>
            Find your Ride or Share your Ride
            {"\n"}
            Turn On your Location
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => router.push("/add-ride")}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Add Ride</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/find-ride")}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Find Ride</Text>
            </Pressable>
          </View>

          <Modal
            visible={isMenuVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleMenu}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Pressable
                  onPress={() => {
                    router.push("/profile");
                    toggleMenu();
                  }}
                >
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>View Profile</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/profile");
                    toggleMenu();
                  }}
                >
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Edit Profile</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/add-ride-preview");
                    toggleMenu();
                  }}
                >
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Your Rides</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push("/login");
                    toggleMenu();
                  }}
                >
                  <View style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Logout</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", 
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  instructionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: "#f97316", 
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Dashboard;