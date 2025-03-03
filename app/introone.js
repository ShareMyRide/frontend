import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

const IntroOne = () => {
  return (
        <LinearGradient 
          colors={['#f97316', 'white']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/mapview1.png")}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>
              Welcome to ShareMyRide
              {"\n"}- Your Journey, Your Way -
            </Text>
            <Text style={styles.description}>
              "Welcome to ShareMyRide – Your Journey, Shared. Discover
              convenient, affordable rides with others heading your way.
              Let’s get you moving!"
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => router.push("/login")}
                style={styles.skipButton}
              >
                <Text style={styles.buttonText}>Skip</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/introtwo")}
                style={styles.nextButton}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  skipButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
});

export default IntroOne;