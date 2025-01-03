import CustomListView from "../components/ride-listview";
import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
const ridepreview = () => {
  const [data, setData] = useState([
    { id: 1, title: "Date", description: "1st Ride Details" },
    { id: 2, title: "Date", description: "2nd Ride Details" },
  ]);

  const handleItemPress = (item) => {
    console.log("Item pressed:", item);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>

        <View className="p-4  bg-gray-300 h-screen flex items-center justify-center">

          <Text className="text-3xl font-bold text-center">Your Rides</Text>
          <CustomListView
            data={data}
            onItemPress={handleItemPress}
            isLoading={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ridepreview;
