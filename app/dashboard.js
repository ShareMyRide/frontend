import React, { useState, useEffect } from "react";
import { Pressable, Text, View, Modal, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = ({ user }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [userData, setUserData] = useState(user);
  
  useEffect(() => {
    console.log("Dashboard received user:", user);
    // If no user data is passed as prop, try to get it from AsyncStorage
    const getUserData = async () => {
      if (!user) {
        try {
          const storedUserData = await AsyncStorage.getItem("userData");
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      }
    };
    
    getUserData();
  }, [user]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateToProfile = async () => {
    try {
      // Get the latest user data from AsyncStorage
      const storedUserData = await AsyncStorage.getItem("userData");
      
      // Navigate to profile with user data
      router.push({
        pathname: "/profile",
        params: { user: storedUserData || JSON.stringify(userData) }
      });
      
      toggleMenu();
    } catch (error) {
      console.error("Error navigating to profile:", error);
      // Fallback navigation without parameters
      router.push("/profile");
      toggleMenu();
    }
  };

  const navigateToChatbot = () => {
    router.push("/chatbot");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="#333" />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <Pressable onPress={navigateToChatbot} style={styles.chatbotButton}>
          <Ionicons name="chatbubble-ellipses" size={28} color="#f97316" />
        </Pressable>
      </View>

      {/* Display user information if available */}
      {userData && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Welcome, {userData.username || userData.firstname || userData.name || "User"}
          </Text>
          <Text style={styles.emailText}>{userData.email}</Text>
        </View>
      )}

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

      {/* Floating chatbot button for easy access */}
      <Pressable 
        onPress={navigateToChatbot} 
        style={styles.floatingChatButton}
      >
        <Ionicons name="chatbubble" size={24} color="#FFFFFF" />
        <Text style={styles.chatButtonText}>Support</Text>
      </Pressable>

      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable onPress={navigateToProfile}>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>View Profile</Text>
              </View>
            </Pressable>
            <Pressable onPress={navigateToProfile}>
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
                router.push("/chatbot");
                toggleMenu();
              }}
            >
              <View style={styles.menuItem}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#f97316" style={{marginRight: 10}} />
                <Text style={styles.menuItemText}>Support Chat</Text>
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
  );
};

const styles = StyleSheet.create({
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
  chatbotButton: {
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
  userInfo: {
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  emailText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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
  floatingChatButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#f97316",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
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
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Dashboard;