import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const introone = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="bg-gray-400 flex flex-col items-center justify-center h-screen mb-3">
          <Image
            source={require("../assets/images/mapview1.png")}
            style={{ width: "100%", height: "50%", resizeMode: "cover" }}
          />
          <View className="flex-1 items-center justify-center">
            <Text className="mt-4 text-4xl text-center ">
              Welcome to ShareMyRide
              {"\n"}-Your Journey Your Way-
            </Text>
            <Text className="mt-5 text-1xl text-center">
              "Welcome to ShareMyRide – Your Journey,{"\n"} Shared. Discover
              convenient, {"\n"}affordable rides with others heading your way.{" "}
              {"\n"}Let’s get you moving!"
            </Text>
            <View className="flex items-center justify-center flex-row gap-10 mb-5">
              <Pressable
                onPress={() => {
                  router.push("/login");
                }}
                className="bg-gray-200 mt-4 hover:bg-gray-300 rounded-full"
                style={{ width: 180, padding: 16, justifyContent: "center" }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Skip
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push("/introtwo");
                }}
                className="bg-orange-600 mt-4 hover:bg-blue-700 rounded-full"
                style={{ width: 180, padding: 16, justifyContent: "center" }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Next
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default introone;
