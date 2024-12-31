import React from "react";
import { Pressable, Text, View } from "react-native";
import { Link,router } from "expo-router";

const dashboard = () => {
  return (
    <View className="max-w-screen">
      <Text className="mt-5 text-3xl text-center">dashboard</Text>
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
        <Pressable onPress={()=>{router.push("/find-ride")}} 
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Text className="text-white">Find Ride</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default dashboard;
