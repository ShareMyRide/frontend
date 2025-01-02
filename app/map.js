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
  