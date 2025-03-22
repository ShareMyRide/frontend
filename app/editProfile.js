import React, { useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const editProfile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    fullName: "John Michael Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, CA 91234, USA",
    vehicle: "2022 Honda Civic, License Plate: ABC-1234",
    imageUrl: require("../assets/images/images.jpeg"),
    isEditing: {
      name: false,
      fullName: false,
      email: false,
      phoneNumber: false,
      address: false,
      vehicle: false,
    },
    nicNumber: "123456789V",
  });

  const handleFieldPress = (field) => {
    setProfile({
      ...profile,
      isEditing: { ...profile.isEditing, [field]: true },
    });
  };

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      isEditing: {
        name: false,
        fullName: false,
        email: false,
        phoneNumber: false,
        address: false,
        vehicle: false,
      },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileHeader}>
            <Image source={profile.imageUrl} style={styles.profileImage} />
            <Text>
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

            {/* ... (Email, Phone Number, Address, Vehicle - same pattern) */}

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
              <Text style={styles.detailLabel}>Vehicle Details:</Text>
              <View style={styles.detailBox}>
                <TextInput
                  style={styles.editableInput}
                  value={profile.vehicle}
                  multiline
                  onChangeText={(text) => handleInputChange("vehicle", text)}
                  onBlur={() =>
                    setProfile({
                      ...profile,
                      isEditing: { ...profile.isEditing, vehicle: false },
                    })
                  }
                  autoFocus={profile.isEditing.vehicle}
                  onPressIn={() => handleFieldPress("vehicle")}
                />
              </View>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.detailLabel}>NIC Number:</Text>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{profile.nicNumber}</Text>
              </View>
            </View>
          </View>

          <View style={styles.navigationLinks}>
            <Link href="/review" asChild>
              <Text style={styles.reviewLink}>View Reviews</Text>
            </Link>
                    
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
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
    }, saveButton: {
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
    saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    },
});

export default editProfile;
