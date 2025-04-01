import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const API_URL = `http://${BACKEND_URL}:2052/api/ride`; // Change to your actual backend URL

const Requests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    !loading && fetchRideRequests();
  }, []);

  useEffect(() => {
    console.log(2, requests);
  }, [requests]);

  const fetchRideRequests = async () => {
    try {
      setLoading(true);

      // Get the token from storage
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      if (!token) {
        setError("Authentication required. Please login.");
        setLoading(false);
        return;
      }

      // Use the endpoint for getting all rides by the logged-in user
      // You'll need to create this endpoint on your backend if it doesn't exist
      const response = await axios.post(`${API_URL}/ride/getRequests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User requests received:", response.data);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching user requests:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      setError(error.response?.data?.message || "Failed to load your rides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Requests</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  rideList: {
    paddingBottom: 80,
  },
  rideCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  detailValue: {
    flex: 2,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  viewButton: {
    backgroundColor: "#007bff",
  },
  editButton: {
    backgroundColor: "#f0ad4e",
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 32,
  },
  addButton: {
    backgroundColor: "#28a745",
  },
  homeButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Requests;
