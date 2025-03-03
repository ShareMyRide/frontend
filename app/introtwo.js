import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

const IntroTwo = () => {
  const handleSkip = () => {
    router.push("/login");
  };

  const handleNext = () => {
    router.push("/introthird");
  };

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
            <Image source={require("../assets/images/introtwo.jpg")} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.title}>
                Choose Your Ride{"\n"}-Join With Others Ride-
              </Text>
              <Text style={styles.description}>
                "Find Your Perfect Ride. 
                {"\n"}Browse available routes and book your spot in just a few taps.
                {"\n"}Travel with ease and meet fellow travelers."
              </Text>
              <View style={styles.buttonContainer}>
                <Pressable style={[styles.button, styles.skipButton]} onPress={handleSkip}>
                  <Text style={styles.buttonText}>Skip</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.nextButton]} onPress={handleNext}>
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
  },
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    marginTop: 20,
    fontSize: 17,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 50, // Widened buttons
    borderRadius: 30,
    justifyContent: "center",
  },
  skipButton: {
    backgroundColor: "#EEEEEE",
  },
  nextButton: {
    backgroundColor: "#F97316",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default IntroTwo;