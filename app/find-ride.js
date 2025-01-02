import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const FindRide = () => {
  const [searchText, setSearchText] = useState('');
  const windowWidth = Dimensions.get('window').width; 

  const rides = [
    { 
      start: 'Colombo', 
      end: 'Kandy', 
      seats: 2 
    },
    { 
      start: 'Galle', 
      end: 'Matara', 
      seats: 1 
    },
    { 
      start: 'Jaffna', 
      end: 'Colombo', 
      seats: 3 
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.rideItem}>
      <Text style={styles.rideLabel}>Starting Point:</Text>
      <Text>{item.start}</Text> 
      <Text style={styles.rideLabel}>Ending Point:</Text>
      <Text>{item.end}</Text> 
      <Text style={styles.rideLabel}>Available Seats:</Text>
      <Text>{item.seats}</Text> 
    </View>
  );

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

      <View style={styles.ridesList}> 
        <FlatList 
          data={rides}
          renderItem={renderItem} 
          keyExtractor={(item) => item.start + item.end} // Unique key for each item
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
  ridesList: {
    marginTop: 20, 
  },
  rideItem: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 10, 
    marginBottom: 10, 
  },
  rideLabel: {
    fontWeight: 'bold', 
  },
});

export default FindRide;