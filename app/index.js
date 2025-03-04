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
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <LinearGradient 
      colors={['#f97316', 'white']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
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
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 30, 
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    margin: 20,
    backgroundColor: 'transparent', 
  },
  textContainer: {
    marginBottom: 100,
  },
  welcomeText: {
    fontSize: 30,
    textAlign: "left",
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
    marginBottom: 280,
    borderRadius: 75,
  },
  loadingContainer: {
    marginTop: 60,
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
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});