import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function map() {
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [coordinates, setCoordinates] = useState([]);
    const [markers, setMarkers] = useState([]);
  
    const fetchRoute = async () => {
      if (!startLocation || !endLocation) {
        Alert.alert('Error', 'Please enter both start and end locations.');
        return;
      }
  
      try {
        
        const apiKey = 'AIzaSyAiQ_WJER_3HDCs0B6tH01WPTCzB1COSLA'; 
        const response = await axios.get(
          `https://api.openrouteservice.org/v2/directions/driving-car`,
          {
            params: {
              api_key: apiKey,
              start: startLocation, 
              end: endLocation, 
            },
          }
        );
  
        
        const routeCoordinates = response.data.features[0].geometry.coordinates.map(
          ([longitude, latitude]) => ({ latitude, longitude })
        );
  
        setCoordinates(routeCoordinates);
        setMarkers([
          { latitude: routeCoordinates[0].latitude, longitude: routeCoordinates[0].longitude },
          { latitude: routeCoordinates[routeCoordinates.length - 1].latitude, longitude: routeCoordinates[routeCoordinates.length - 1].longitude },
        ]);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch the route.');
      }
    };
  
    return (
        <View style={styles.container}>
          <MapView style={styles.map} initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
            {markers.map((marker, index) => (
              <Marker key={index} coordinate={marker} />
            ))}
            <Polyline coordinates={coordinates} strokeWidth={4} strokeColor="blue" />
          </MapView>
          <View style={styles.controls}>
            <TextInput
              style={styles.input}
              placeholder="Start Location (lng,lat)"
              value={startLocation}
              onChangeText={setStartLocation}
            />
            <TextInput
              style={styles.input}
              placeholder="End Location (lng,lat)"
              value={endLocation}
              onChangeText={setEndLocation}
            />
            <Button title="Get Route" onPress={fetchRoute} />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    controls: {
      position: 'absolute',
      bottom: 10,
      left: 10,
      right: 10,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      marginBottom: 10,
      padding: 8,
      borderRadius: 4,
    },
  });