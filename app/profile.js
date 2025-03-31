import React, { useEffect, useState } from "react";
import { Image, Text, View, StyleSheet, ScrollView, ActivityIndicator,Pressable } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";




const profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rideData, setRideData] = useState(null);
  const params = useLocalSearchParams();
  
 
  const propUser = params.user;

  const fetchProfile = async () => {
    try {
      
      const token = await AsyncStorage.getItem("token");
      let userId = await AsyncStorage.getItem("userId");
      
     
      if (propUser) {
        console.log("Using user data from props:", propUser);
        
        
        const parsedUser = typeof propUser === 'string' ? JSON.parse(propUser) : propUser;
        
      
        if (parsedUser.id || parsedUser._id) {
          userId = parsedUser.id || parsedUser._id;
        }
      }
      
      
      if (!userId || !token) {
        const cachedUserData = await AsyncStorage.getItem("userData");
        if (cachedUserData) {
          const parsedCachedData = JSON.parse(cachedUserData);
          userId = parsedCachedData.id || parsedCachedData._id;
        }
        
        if (!userId) {
          setError("User ID not found");
          setLoading(false);
          return;
        }
        
        if (!token) {
          setError("Not logged in!");
          setLoading(false);
          return;
        }
      }
      
      
      console.log("Fetching detailed user data for ID:", userId);

      const response = await axios.get(`http://192.168.216.78:2052/api/auth/users/${userId}`, {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Fetched detailed user data:", response.data);
      
      
      await AsyncStorage.setItem("userData", JSON.stringify(response.data));
      
      setUserData(response.data);
      if (response.data && (response.data.id || response.data._id)) {
        // Fetch the most recent ride for this user
        const userId = response.data.id || response.data._id;
        
        try {
          const rideResponse = await axios.get(
            `http://192.168.216.78:2052/api/ride/latestByUser/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          console.log("Fetched ride data:", rideResponse.data);
          setRideData(rideResponse.data);
          
          // Update the user data with vehicle details if not already present
          if (rideResponse.data && !response.data.vehicleDetails) {
            const updatedUserData = {
              ...response.data,
              vehicleType: rideResponse.data.vehicleType,
              vehicleNumber: rideResponse.data.vehicleNumber,
              vehicleDetails: `${rideResponse.data.vehicleType || 'Unknown'} (${rideResponse.data.vehicleNumber || 'No plate number'})`
            };
            
            setUserData(updatedUserData);
            await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
          } else {
            setUserData(response.data);
            await AsyncStorage.setItem("userData", JSON.stringify(response.data));
          }
        } catch (rideError) {
          console.error("Error fetching ride data:", rideError);
          // Still use the user data even if ride fetch fails
          setUserData(response.data);
          await AsyncStorage.setItem("userData", JSON.stringify(response.data));
        }
      }
      
      setLoading(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
      setLoading(false);
      
      
      try {
        const cachedUserData = await AsyncStorage.getItem("userData");
        if (cachedUserData) {
          const parsedCachedData = JSON.parse(cachedUserData);
          console.log("Using cached user data as fallback:", parsedCachedData);
          setUserData(parsedCachedData);
          setError(null);
        }
      } catch (cacheError) {
        console.error("Error retrieving cached data:", cacheError);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [propUser]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (error) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Link href="/login" asChild>
              <Text style={styles.loginLink}>Go to Login</Text>
            </Link>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!userData) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No user data available</Text>
            <Link href="/login" asChild>
              <Text style={styles.loginLink}>Go to Login</Text>
            </Link>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Debug the user data structure
  console.log("User data structure:", Object.keys(userData));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              source={require("../assets/images/images.jpeg")}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>
              {userData.firstname || userData.username || "User"} {userData.lastname || ""}
            </Text>

          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Full Name:</Text>
              <View style={styles.detailBox}>

                <Text style={styles.detailValue}>
                  {userData.firstname || userData.username || "User"} {userData.lastname || ""}
                </Text>

              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Email:</Text>
              <View style={styles.detailBox}>

                <Text style={styles.detailValue}>{userData.email || "No email provided"}</Text>

              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>NIC:</Text>
              <View style={styles.detailBox}>

                <Text style={styles.detailValue}>{userData.NIC || "Not provided"}</Text>

              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Contact Number:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{userData.mobileNumber || "Not provided"}</Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Address:</Text>
              <View style={styles.detailBox}>

                <Text style={styles.detailValue}>
                  {userData.address || "Address not provided"}
                </Text>

              </View>
            </View>
            <View style={styles.detailContainer}>

            <Text style={styles.detailLabel}>Vehicle Details:</Text>
            <View style={styles.detailBox}>
            <Text style={styles.detailValue}>
              {userData.vehicleDetails || 
              (userData.vehicleType && userData.vehicleNumber 
                ? `${userData.vehicleType} (${userData.vehicleNumber})` 
                : (rideData && rideData.vehicleType 
                    ? `${rideData.vehicleType} (${rideData.vehicleNumber || 'No plate number'})` 
                    : "Vehicle details not provided"))}

                </Text>

              </View>
            </View>
          </View>
           <View style={styles.buttonContainer}>
                        <Pressable
                          onPress={() => {
                            router.push("/editProfile");
                          }}
                          style={styles.editButton}
                        >
                          <Text style={styles.buttonText}>Edit Profile</Text>
                        </Pressable>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    marginBottom: 20,
    textAlign: "center",
  },
  loginLink: {
    fontSize: 16,
    color: "#f97316",
    fontWeight: "bold",
    textDecorationLine: "underline",
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

export default profile;

