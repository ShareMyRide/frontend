import React, { useEffect, useState } from "react";
import { Image, Text, View, StyleSheet, ScrollView,ActivityIndicator} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        return alert("Not logged in!");
      }

      const response = await axios.get(`http://192.168.216.78:2052/api/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              source={require("../assets/images/images.jpeg")}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userData.firstname} {userData.lastname}</Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Full Name:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{userData.firstname} {userData.lastname}</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Email:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{userData.email}</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>NIC:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{userData.NIC}</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Address:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>
                  123 Main St, Anytown, CA 91234, USA
                </Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Vehicle Details:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>
                  2022 Honda Civic, License Plate: ABC-1234
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.navigationLinks}>
            <Link href="/review" asChild>
              <Text style={styles.reviewLink}>View Reviews</Text>
            </Link>
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
});

export default Profile;
