import React from "react";
import { Pressable, Image, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const profile = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="flex flex-col justify-between items-center ">
          <Image
            source={require("../assets/images/splash-icon.png")}
            style={{ width: 100, height: 100 }}
          />
          <Text>Name: </Text>
          <View className="flex items-center justify-center flex-row gap-10">
            <Link href="/review" asChild>
              <Text className="text-red-300">Reviews</Text>
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
