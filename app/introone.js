import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Link, router } from "expo-router";

const introone = () => {
    
  return (
    <View className="max-w-screen">
      <Text className="mt-5 text-4xl text-center ">Welcome to ShareMyRide
      {"\n"}-Your Journey Your Way</Text>
      <Text className="mt-5 text-center">
        "Welcome to ShareMyRide – Your Journey,{"\n"} Shared. Discover convenient, {"\n"}affordable rides with others heading your way. {"\n"}Let’s get you moving!"
      </Text>
      <View className="flex items-center justify-center flex-row gap-10">

        
        <Pressable  onPress={() => { router.push("/login") }} 
         className="bg-gray-200 mt-4 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">
            <Text className="text-black">Skip</Text>
        </Pressable>

        <Pressable  onPress={()=>{router.push("/")}} 
         className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Text className="text-white" >Next</Text>
          </Pressable>

      </View>
    </View>
  );
}

export default introone;