import { Pressable,Image, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Link, router } from "expo-router";
export default function App() {
  /*const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('introone'); 
    }, 2500);

    return () => clearTimeout(timer); 
  }, []); 
*/
  return (
  <View onClick={()=> {navigation.navigate('/introone')}}
    className="p-4 h-screen flex items-center justify-center bg-lime-500">
      <Text className="mt-5 text-3xl font-bold text-white">welcome</Text>
      <Text className="mb-10 text-6xl font-">Share My Ride</Text>
       <Image
                  source={require("../assets/images/ShareMyRide-logo.jpg")}
                  style={{ width: 150, height: 150 }}
                />
      <View /> 
      <ActivityIndicator size="large" color="#343438" /> 
      <Pressable  onPress={()=>{router.push("/introtwo")}} 
               className="bg-black mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <Text className="text-white" >Next</Text>
                </Pressable>
    </View>
  );
}
