import React from 'react';
import { FlatList,Text, View } from 'react-native';
const addridepreview = () =>{
    return(
        <View className="mt-10 flex flex-col justify-between items-center " >
            <Text className="font-bold text-3xl "> Your Rides </Text>
            <FlatList className="mt-10"
        data={[
          {key: 'Ride date:'},
          {key: 'Ride details: '},
          {key: 'ride status:'}
        ]}
        renderItem={({item}) => <Text>{item.key}</Text>}
      />
            
        </View>
    );
}
export default addridepreview;