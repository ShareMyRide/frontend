import React from "react";
import { Pressable, Text, View } from "react-native";
import { Link,router } from "expo-router";

const dashboard = () => {
  return (
    <View className="p-4 bg-gray-400 max-w-screen">
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
      <Pressable onPress={()=>{router.push("/add-ride")}} 
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Text className="text-white">Add Ride</Text>
        </Pressable>
        <Pressable className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Text className="text-white">Find Ride</Text>
        </Pressable>

      </View>
    </View>
  );
};
export default dashboard;
