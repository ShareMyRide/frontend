import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const introthird = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="flex flex-col items-center justify-center h-screen bg-gray-400 ">
          <Image
            source={require("../assets/images/introthree.jpg")}
            style={{ width: "100%", height: "50%", resizeMode: "cover" }}
          />
          <View className="flex-1 items-center justify-center">
            <Text className="mt-5 text-4xl text-center ">
              Totally Free
              {"\n"}-Pay Them Only Tips-
            </Text>
            <Text className="mt-5 text-1xl text-center">
              "Without any payment ,{"\n"}You can join with others and only pay
              tip you can"
            </Text>
            <View className="flex items-center justify-center flex-row gap-10">
              <Pressable
                onPress={() => {
                  router.push("/login");
                }}
                className="bg-orange-600 mt-4 hover:bg-blue-700 rounded-full"
                style={{ width: 200, padding: 16, justifyContent: "center" }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Let's Get Start
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default introthird;
