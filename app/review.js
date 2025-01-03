import React from 'react';
import { Pressable,FlatList,Text, View } from 'react-native';
import {  router } from "expo-router";

const review = () =>{
    return(

        <View className="mp-10 flex flex-col justify-between items-center  bg-gray-400" >

            <Text className="font-bold text-3xl "> Review Details</Text>
            <FlatList className="mt-10"
        data={[
          {key: 'Name of the reviewer:'},
          {key: 'Ratings: '},
          {key: 'Review details:'}
        ]}
        renderItem={({item}) => <Text>{item.key}</Text>}
      />
        <Pressable  onPress={()=>{router.push("/addReview")}} 
                 className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <Text className="text-white" >add review</Text>
        </Pressable>
            
        </View>
    );
}
export default review;