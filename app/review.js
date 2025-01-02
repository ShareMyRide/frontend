import React from 'react';
import { FlatList,Text, View } from 'react-native';
const review = () =>{
    return(
        <View className="mt-10 flex flex-col justify-between items-center " >
            <Text className="font-bold text-3xl "> Review Details</Text>
            <FlatList className="mt-10"
        data={[
          {key: 'Name of the reviewer:'},
          {key: 'Ratings: '},
          {key: 'Review details:'}
        ]}
        renderItem={({item}) => <Text>{item.key}</Text>}
      />
            
        </View>
    );
}
export default review;