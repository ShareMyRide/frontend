import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import Home from "./dashboard";
import Activities from "./add-ride-preview";
import Review from "./review";
import Profile from "./profile";

const BottomNavi=({ route }) =>{
  const { user } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "Home",
      title: "Dashboard",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
    {
      key: "Activities",
      title: "Your Rides",
      focusedIcon: "school",
      unfocusedIcon: "school-outline",
    },
    {
      key: "Review",
      title: "Reviews",
      focusedIcon: "book-open",
      unfocusedIcon: "book-open-outline",
    },
    {
      key: "Profile",
      title: "Profile",
      focusedIcon: "book-open",
      unfocusedIcon: "book-open-outline",
    },
  ]);

  const renderTo = BottomNavigation.SceneMap({
    home: () => <Home user={user} />,
    activities: () => <Activities user={user} />,
    review: () => <Review user={user} />,
    profile: () => <Profile user={user} />,
    });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderTo}
    />
  );
};

export default BottomNavi;
