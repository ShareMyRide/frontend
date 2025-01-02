import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const FindRide = () => {
  const [searchText, setSearchText] = useState('');
  const windowWidth = Dimensions.get('window').width; 

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { 
          backgroundColor: '#5c5a54', 
          width: windowWidth * 0.85, 
          height: 50, 
          alignSelf: 'center' 
        }]}>
        <Ionicons name="search" size={24} color="white" style={styles.searchIcon} />
        <TextInput 
          style={[styles.input, { color: 'white', fontSize: 20 }]} 
          placeholder="Search for rides..." 
          placeholderTextColor="lightgray"
          value={searchText}
          onChangeText={(text) => setSearchText(text)} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16, 
  },
});

export default FindRide;