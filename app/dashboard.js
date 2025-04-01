import React, { useState, useEffect } from "react";
import { Pressable, Text, View, Modal, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BACKEND_URL = process.env.BACKEND_URL;

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

  const closeMenu = () => {
    setIsMenuVisible(false);
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
      
      closeMenu();
    } catch (error) {
      console.error("Error navigating to profile:", error);
      // Fallback navigation without parameters
      router.push("/profile");
      closeMenu();
    }
  };
  
  const navigateToEditProfile = () => {
    router.push("/editProfile");
    closeMenu();
  };

  const navigateToChatbot = () => {
    router.push("/chatbot");
  };
  const handleLogout = async () => {
    try {
      // Get the authentication token from AsyncStorage
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token for logout:", token ? token.substring(0, 10) + "..." : "Not found");
      
      if (token) {
        // Call the logout API endpoint
        try {
          const response = await fetch("http://${BACKEND_URL}:2052/api/auth/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            console.log("Logged out successfully on server");
          } else {
            console.warn("Server logout failed with status:", response.status);
          }
        } catch (networkError) {
          console.error("Network error during server logout:", networkError);
        }
      } else {
        console.warn("No authentication token found for logout - continuing with local logout");
      }
      
      // Continue with local logout regardless of server response
    } catch (error) {
      console.error("Error during logout preparation:", error);
    } finally {
      // Always clear local storage and redirect
      try {
        await AsyncStorage.multiRemove(["authToken", "userData"]);
        console.log("Local storage cleared");
        router.replace("/login");
        closeMenu();
      } catch (storageError) {
        console.error("Error clearing storage:", storageError);
        // Last resort - just redirect
        router.replace("/login");
        closeMenu();
      }
    }
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
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Menu</Text>
                  <Pressable onPress={closeMenu} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#333" />
                  </Pressable>
                </View>
                
                <Pressable onPress={navigateToProfile}>
                  <View style={styles.menuItem}>
                    <Ionicons name="person" size={20} color="#f97316" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>View Profile</Text>
                  </View>
                </Pressable>
                
                <Pressable onPress={navigateToEditProfile}>
                  <View style={styles.menuItem}>
                    <Ionicons name="create" size={20} color="#f97316" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Edit Profile</Text>
                  </View>
                </Pressable>
                
                <Pressable
                  onPress={() => {
                    router.push("/add-ride-preview");
                    closeMenu();
                  }}
                >
                  <View style={styles.menuItem}>
                    <Ionicons name="car" size={20} color="#f97316" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Your Rides</Text>
                  </View>
                </Pressable>
                
                <Pressable onPress={handleLogout}>
                  <View style={styles.menuItem}>
                    <Ionicons name="log-out" size={20} color="#f97316" style={styles.menuIcon} />
                    <Text style={styles.menuItemText}>Logout</Text>
                  </View>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  modalContent: {
    backgroundColor: "white",
    marginTop: 50,
    marginLeft: 10,
    padding: 20,
    borderRadius: 12,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Dashboard;