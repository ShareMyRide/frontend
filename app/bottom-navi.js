import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import Home from "./dashboard";
import Activities from "./add-ride-preview";
import Review from "./review";
import Profile from "./profile";

const BottomNavi = () => {
  // Use useLocalSearchParams to get the params passed through navigation
  const params = useLocalSearchParams();
  const user = params.user ? (typeof params.user === 'string' ? JSON.parse(params.user) : params.user) : null;
  
  // Log to check if user data is received
  console.log("User data in BottomNavi:", user);

  const [index, setIndex] = useState(0); // Start with Dashboard tab

  const [routes] = useState([
    {
      key: "home",
      title: "Dashboard",
      focusedIcon: "view-dashboard",
      unfocusedIcon: "view-dashboard-outline",
    },
    {
      key: "activities",
      title: "Your Rides",
      focusedIcon: "car",
      unfocusedIcon: "car-outline",
    },
    {
      key: "review",
      title: "Reviews",
      focusedIcon: "message-text",
      unfocusedIcon: "message-text-outline",
    },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

 
  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'home':
        return <Home user={user} jumpTo={jumpTo} />;
      case 'activities':
        return <Activities user={user} jumpTo={jumpTo} />;
      case 'review':
        return <Review user={user} jumpTo={jumpTo} />;
      case 'profile':
        return <Profile user={user} jumpTo={jumpTo} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
        barStyle={{ backgroundColor: "#ffffff" }}
        activeColor="#f97316" // Orange active color
        inactiveColor="#aaa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BottomNavi;