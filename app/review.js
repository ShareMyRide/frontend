import React from "react";
import { Pressable, FlatList, Text, View, Button } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
//import HeaderWithBackButton from "../components/HeaderWithBackButton"; // Import the header component

const Review = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#E0E0E0" }}>
        {/* <HeaderWithBackButton title="Review Details" /> */}
        <View style={{ flex: 1, padding: 20, backgroundColor: "#E0E0E0" }}>
          <View style={{ alignItems: "center" }}>
            <FlatList
              style={{ marginTop: 20, width: "100%" }}
              data={[
                { key: "Name of the reviewer:" },
                { key: "Ratings: " },
                { key: "Review details:" },
              ]}
              renderItem={({ item }) => (
                <View style={{ padding: 10, backgroundColor: "#FFFFFF", marginBottom: 10, borderRadius: 8 }}>
                  <Text style={{ fontSize: 16 }}>{item.key}</Text>
                </View>
              )}
            />
            <Pressable
              onPress={() => {
                router.push("/addReview");
              }}
              style={{
                backgroundColor: "#f97316",
                marginTop: 20,
                paddingVertical: 14,
                paddingHorizontal: 30,
                borderRadius: 30,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>Add Review</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Review;