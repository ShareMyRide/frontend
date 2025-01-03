import React from "react";
import { Pressable, Image, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const profile = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="pt-20 flex flex-col  items-center h-screen text-3xl font-bold">
          <Image
            source={require("../assets/images/images.jpeg")}
            style={{ width: 100, height: 100 }}
          />
          <Text>Name: </Text>
          <View className="flex items-center justify-center flex-row gap-10">
            <Link href="/review" asChild>
              <Text className="text-red-300 underline">Reviews</Text>
            </Link>
          </View>

          <Text>phone Number: </Text>
          <Text>Address: </Text>
          <Text>Vehicle Details: </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default profile;
