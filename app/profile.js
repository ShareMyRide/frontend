import React from 'react';
import { Image, Text, View } from 'react-native';
const profile = () =>{
    return(
        <View className="flex flex-col justify-between items-center " >
            <Image source={require('../assets/images/splash-icon.png')} style={{width: 100, height: 100}}/>
            <Text>Name: </Text>
            <Text>phone Number: </Text>
            <Text>Address: </Text>
            <Text>Vehicle Details: </Text>
        </View>
    );
}
export default profile;