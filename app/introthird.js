import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

const IntroThird = () => {
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
            source={require("../assets/images/introthree.jpg")}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>Totally Free{"\n"}-Pay Them Only Tips-</Text>
            <Text style={styles.description}>
              "Without any payment,{"\n"}You can join with others and only pay
              tip you can"
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => {
                  router.push("/login");
                }}
                style={styles.startButton}
              >
                <Text style={styles.buttonText}>Let's Get Start</Text>
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
    fontSize: 30, 
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    marginTop: 20,
    fontSize: 16, 
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  startButton: {
    backgroundColor: "#F97316", 
    width: 200,
    padding: 16,
    justifyContent: "center",
    borderRadius: 999, 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default IntroThird;