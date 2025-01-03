import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Link, router } from "expo-router";

const introone = () => {
  return (
    <View className="flex flex-col items-center justify-center h-screen"> 
      <Image 
        source={require('../assets/images/mapview1.png')} // C:\Users\HP\Desktop\Group Project\assets\images\mapview1.png
        style={{ width: '100%', height: '50%', resizeMode: 'cover' }} 
      /> 
      <View className="flex-1 items-center justify-center"> 
        <Text className="mt-5 text-4xl text-center ">Welcome to ShareMyRide
          {"\n"}-Your Journey Your Way</Text>
        <Text className="mt-5 text-center">
          "Welcome to ShareMyRide – Your Journey,{"\n"} Shared. Discover convenient, {"\n"}affordable rides with others heading your way. {"\n"}Let’s get you moving!"
        </Text>
        <View className="flex items-center justify-center flex-row gap-10">
          <Pressable 
            onPress={() => { router.push("/login") }} 
            className="bg-gray-200 mt-4 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
          >
            <Text className="text-black">Skip</Text>
          </Pressable>
          <Pressable 
            onPress={()=>{router.push("/introtwo")}} 
            className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <Text className="text-white" >Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default introone;