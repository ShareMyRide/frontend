import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet } from "react-native";
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';

const dashboard = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <View className="max-w-screen">
      <View className="flex flex-row justify-between items-center">
        <Pressable onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="black" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="mt-5 text-3xl ">Dashboard</Text>
        </View>
      </View>

      <Text className="mt-5 text-center">
        Find your Ride or Share your Ride
        {"\n"}
        Turn On your Location
      </Text>

      <View className="flex items-center justify-center flex-row gap-10">
        <Pressable
          onPress={() => {
            router.push("/add-ride");
          }}
          className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <Text className="text-white">Add Ride</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push("/find-ride");
          }}
          className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <Text className="text-white">Find Ride</Text>
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
                <Text>View Profile</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/profile");
                toggleMenu();
              }}
            >
              <View style={styles.menuItem}>
                <Text>Edit Profile</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/add-ride-preview");
                toggleMenu();
              }}
            >
              <View style={styles.menuItem}>
                <Text>Your Rides</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/login");
                toggleMenu();
              }}
            >
              <View style={styles.menuItem}>
                <Text>Logout</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

//
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={{
            uri: 'https://via.placeholder.com/150', 
          }}
          style={styles.logo}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>Welcome to the App!</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.appName}>Share My Ride</Text>
      </View>

      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  content: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
  bottomSection: {
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
  },
});

export default dashboard;

