import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Link, router } from "expo-router";

const introthird = () => {
    
  return (
    <View className="max-w-screen">
      <Text className="mt-5 text-4xl text-center ">
      Totally Free
      {"\n"}-Pay Them Only Tips</Text>
      <Text className="mt-5 text-center">
      “Without any payment ,{"\n"}You can join with others and only pay tip you can”
      </Text>
      <View className="flex items-center justify-center flex-row gap-10">

        <Pressable  onPress={()=>{router.push("/login")}} 
         className="bg-orange-600 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Text className="text-white" >Let's Get Start </Text>
          </Pressable>

      </View>
    </View>
  );
}

export default introthird;