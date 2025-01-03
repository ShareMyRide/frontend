import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Link, router } from "expo-router";

const introtwo = () => {
  return (
    <View className="flex flex-col items-center justify-center h-screen"> 
      <Image 
        source={require('../assets/images/introtwo.jpg')} 
        style={{ width: '100%', height: '50%', resizeMode: 'cover' }} 
      /> 
      <View className="flex-1 items-center justify-center"> 
        <Text className="mt-5 text-5xl text-center ">Choose Your Ride
          {"\n"}-Join With Others Ride</Text>
        <Text className="mt-5 text-3xl text-center">
          "Find Your Perfect Ride. {"\n"}Browse available routes and book your spot in just a few taps. {"\n"}Travel with ease and meet fellow travelers."
        </Text>
        <View className="flex items-center justify-center flex-row gap-10">
          <Pressable 
            onPress={() => { router.push("/login") }} 
            className="bg-gray-200 mt-4 hover:bg-gray-300 rounded-full" 
            style={{ width: 180, padding: 16, justifyContent: 'center' }} 
          > 
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Skip</Text> 
          </Pressable>
          <Pressable 
            onPress={()=>{router.push("/introthird")}} 
            className="bg-blue-500 mt-4 hover:bg-blue-700 rounded-full" 
            style={{ width: 180, padding: 16, justifyContent: 'center' }} 
          > 
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Next</Text> 
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default introtwo;