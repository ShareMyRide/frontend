import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { router } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.appNameText}>Share My Ride</Text>
        </View>
        <Image
          source={require("../assets/images/ShareMyRide-logo.jpg")}
          style={styles.logo}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/introone")}
      >
        <Text style={styles.nextButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E0E0E0", 
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 28, 
    textAlign: "center",
    fontWeight: "bold",
    color: "#333", 
    marginBottom: 5,
  },
  appNameText: {
    fontSize: 40, 
    fontWeight: "bold",
    color: "#333", 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
  },
  loadingContainer: {
    marginTop: 350,
  },
  nextButton: {
    backgroundColor: "#f97316", 
    paddingVertical: 14, 
    borderRadius: 30,
    width: width * 0.6,
    marginBottom: 30,
    alignSelf: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16, 
    fontWeight: "600", 
    textAlign: "center",
  },
});