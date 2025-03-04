import React from "react";
import { Pressable, FlatList, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const review = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="pt-20 flex flex-col justify-between bg-gray-400 h-screen">
          <View className="flex items-center">
            <Text className="font-bold text-3xl "> Review Details</Text>
            <FlatList
              className="mt-10"
              data={[
                { key: "Name of the reviewer:" },
                { key: "Ratings: " },
                { key: "Review details:" },
              ]}
              renderItem={({ item }) => <Text>{item.key}</Text>}
            />
            <Pressable
              onPress={() => {
                router.push("/addReview");
              }}
              className="bg-orange-600 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <Text className="text-white">add review</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default review;
