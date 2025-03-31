import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {  useRouter } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL
const API_URL = `http://${BACKEND_URL}:2052`; 

const EditProfile = () => {
    const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    nicNumber: "",
    
    imageUrl: require("../assets/images/images.jpeg"),
    isEditing: {
      name: false,
      fullName: false,
      email: false,
      phoneNumber: false,
      address: false,
      vehicle: false,
      nicNumber: false,
    },
    
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
    
      const userDataString = await AsyncStorage.getItem("userData");
      
      if (userDataString) {
        
        const userData = JSON.parse(userDataString);
        console.log("User data from storage:", userData);
        
        
        updateProfileFromUserData(userData);
      }
      
     
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      
      console.log("Token:", token);
      console.log("UserId:", userId);
      
      if (!token || !userId) {
        throw new Error("Not authenticated");
      }
      
     
      const response = await axios.get(
        `${API_URL}/api/auth/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("API response:", response.data);
      
      
      updateProfileFromUserData(response.data);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile data. Please log in again.");
      setLoading(false);
    }
  };
  
  const updateProfileFromUserData = (userData) => {
   
    const fullName = userData.firstname && userData.lastname 
      ? `${userData.firstname} ${userData.lastname}`
      : userData.username || ""; 
    
    setProfile({
      ...profile,
      name: fullName,
      fullName: fullName,
      email: userData.email || "",
      phoneNumber: userData.mobileNumber || "",
      address: userData.address || "",
      nicNumber: userData.NIC || "",
    });
  };

  const handleFieldPress = (field) => {
    setProfile({
      ...profile,
      isEditing: { ...profile.isEditing, [field]: true },
    });
  };

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      
      if (!token || !userId) {
        Alert.alert("Error", "Not authenticated. Please log in again.");
        return;
      }
      
      
      let firstname = "", lastname = "";
      if (profile.fullName) {
        const nameParts = profile.fullName.split(" ");
        firstname = nameParts[0];
        lastname = nameParts.slice(1).join(" ");
      }
      
      
      const userData = {
        firstname,
        lastname,
        email: profile.email,
        mobileNumber: profile.phoneNumber,
        NIC: profile.nicNumber,
        address: profile.address,
        
      };
      
      console.log("Updating profile with data:", userData);
      
     
      const response = await axios.put(
        `${API_URL}/api/auth/editProfile/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      console.log("Update response:", response.data);
      
      
      const updatedUser = response.data.updateUser || response.data.user;
      if (updatedUser) {
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      }
      
      
      setProfile({
        ...profile,
        isEditing: {
          name: false,
          fullName: false,
          email: false,
          phoneNumber: false,
          address: false,
          nicNumber: false,
         
        },
      });
      
      Alert.alert("Success", "Profile updated successfully", [
        { 
          text: "OK", 
          onPress: () => {
            router.push("/profile");
          } 
        }
      ]);
    } catch (err) {
      console.error("Error updating profile:", err);
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#d32f2f" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <Image source={profile.imageUrl} style={styles.profileImage} />
            <Text style={styles.profileName}>
              {profile.name}
            </Text>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Full Name:</Text>
              <View style={styles.detailBox}>
                <TextInput
                  style={styles.editableInput}
                  value={profile.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                  onBlur={() =>
                    setProfile({
                      ...profile,
                      isEditing: {
                        ...profile.isEditing,
                        fullName: false,
                      },
                    })
                  }
                  autoFocus={profile.isEditing.fullName}
                  onPressIn={() => handleFieldPress("fullName")}
                />
              </View>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Email:</Text>
              <View style={styles.detailBox}>
                <TextInput
                  style={styles.editableInput}
                  value={profile.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  onBlur={() =>
                    setProfile({
                      ...profile,
                      isEditing: {
                        ...profile.isEditing,
                        email: false,
                      },
                    })
                  }
                  autoFocus={profile.isEditing.email}
                  onPressIn={() => handleFieldPress("email")}
                />
              </View>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Phone Number:</Text>
              <View style={styles.detailBox}>
                <TextInput
                  style={styles.editableInput}
                  value={profile.phoneNumber}
                  onChangeText={(text) =>
                    handleInputChange("phoneNumber", text)
                  }
                  onBlur={() =>
                    setProfile({
                      ...profile,
                      isEditing: {
                        ...profile.isEditing,
                        phoneNumber: false,
                      },
                    })
                  }
                  autoFocus={profile.isEditing.phoneNumber}
                  onPressIn={() => handleFieldPress("phoneNumber")}
                />
              </View>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>Address:</Text>
              <View style={styles.detailBox}>
                <TextInput
                  style={styles.editableInput}
                  value={profile.address}
                  multiline
                  onChangeText={(text) => handleInputChange("address", text)}
                  onBlur={() =>
                    setProfile({
                      ...profile,
                      isEditing: { ...profile.isEditing, address: false },
                    })
                  }
                  autoFocus={profile.isEditing.address}
                  onPressIn={() => handleFieldPress("address")}
                />
              </View>
            </View>

           

            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>NIC Number:</Text>
              <View style={styles.detailBox}>
              <TextInput
      style={styles.editableInput}
      value={profile.nicNumber}
      onChangeText={(text) => handleInputChange("nicNumber", text)}
      onBlur={() =>
        setProfile({
          ...profile,
          isEditing: { ...profile.isEditing, nicNumber: false },
        })
      }
      autoFocus={profile.isEditing.nicNumber}
      onPressIn={() => handleFieldPress("nicNumber")}
    />              
    </View>
            </View>
          </View>

          <View style={styles.navigationLinks}>
            
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            
          </View>
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
    centered: {
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: "#555",
    },
    errorText: {
      fontSize: 16,
      color: "#d32f2f",
      textAlign: "center",
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: "#d32f2f",
      padding: 10,
      borderRadius: 5,
    },
    retryButtonText: {
      color: "white",
      fontWeight: "bold",
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
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#CCCCCC",
    },
    detailValue: {
      fontSize: 18,
      color: "#333",
      padding: 10,
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
    buttonContainer: {
      flexDirection: "row",
      gap: 20,
      marginTop: 20,
    },
    saveButton: {
      backgroundColor: "#F97316", 
      width: "100%",
      padding: 16,
      justifyContent: "center",
     
    },
    saveButtonText: {
      fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    },
});

export default EditProfile;