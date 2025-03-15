import CustomListView from "../components/ride-listview";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
//import HeaderWithBackButton from "../components/HeaderWithBackButton"; // Import the header component

const RidePreview = () => {
  const [data, setData] = useState([
    { id: 1, title: "Date", description: "1st Ride Details" },
    { id: 2, title: "Date", description: "2nd Ride Details" },
  ]);

  const handleItemPress = (item) => {
    console.log("Item pressed:", item);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#E0E0E0" }}>
        {/* <HeaderWithBackButton title="Your Rides" /> */}
         <Text className="font-bold text-3xl "> Preview Details</Text>
        <View style={{ flex: 1, padding: 20, backgroundColor: "#E0E0E0" }}>
          <CustomListView
            data={data}
            onItemPress={handleItemPress}
            isLoading={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default  RidePreview;