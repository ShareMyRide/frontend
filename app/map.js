import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

// Your Google Maps API Key (Replace with real value)
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function Mapp() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);

  // 1️⃣ **Fetch Start & End Locations from Database**
  useEffect(() => {
    const fetchLocationsFromDB = async () => {
      try {

        // Replace with your database API call (Firebase, MySQL, etc.)
        //const response = await axios.get("https://your-database-api.com/getLocations");

        //const startCity = response.data.start; // e.g., "Colombo"
        const startCity = "Colombo"

        //const endCity = response.data.end;     // e.g., "Kandy"
        const endCity = "Kandy"

        // 2️⃣ Convert city names into lat/lng
        const startCoords = await geocodeCity(startCity);
        const endCoords = await geocodeCity(endCity);

        if (!startCoords || !endCoords) {
          Alert.alert('Error', 'Could not fetch coordinates.');
          return;
        }

        setStartLocation(startCoords);
        setEndLocation(endCoords);

        
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
        console.error("Error fetching locations:", error);
      }
    };


    fetchLocationsFromDB();
  }, []);

  // 2️⃣ **Convert City Name to Lat/Lng using Google Geocoding API**
  const geocodeCity = async (city) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await axios.get(url);

      if (response.data.results.length > 0) {
        return response.data.results[0].geometry.location; // { lat: ..., lng: ... }
      } else {
        throw new Error(`No coordinates found for city: ${city}`);
      }
    } catch (error) {
      console.error("Geocode error:", error);
      Alert.alert("Error", `Could not fetch coordinates for ${city}`);
    }
  };

  // 3️⃣ **Fetch Route using Google Directions API**
  const fetchRoute = async () => {
    if (!startLocation || !endLocation) {
      Alert.alert("Error", "Start or End location missing.");
      return;
    }

    try {
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.lat},${startLocation.lng}&destination=${endLocation.lat},${endLocation.lng}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await axios.get(directionsUrl);
      if (response.data.routes.length === 0) {
        throw new Error("No route found.");
      }

      const routeCoordinates = response.data.routes[0].legs[0].steps.map(step => ({
        latitude: step.start_location.lat,
        longitude: step.start_location.lng,
      }));

      // Add last point (end location)
      routeCoordinates.push({
        latitude: response.data.routes[0].legs[0].end_location.lat,
        longitude: response.data.routes[0].legs[0].end_location.lng,
      });

      setCoordinates(routeCoordinates);
      setMarkers([
        { latitude: startLocation.lat, longitude: startLocation.lng },
        { latitude: endLocation.lat, longitude: endLocation.lng },
      ]);
    } catch (error) {
      console.error("Route fetch error:", error);
      Alert.alert("Error", "Failed to fetch the route.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 7.2906,  // Default to Sri Lanka
          longitude: 80.6337,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
        <Polyline coordinates={coordinates} strokeWidth={4} strokeColor="blue" />
      </MapView>
      <Button title="Get Route" onPress={fetchRoute} />
    </View>
  );

    geocodeCity('kk')
    const geocodeCity = async (city) => {
      const apiKey = "AIzaSyAiQ_WJER_3HDCs0B6tH01WPTCzB1COSLA";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent('polonnaruwa')}&key=${apiKey}`;
      const response = await fetch(url);
  
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        console.log(data.results[0].geometry.location)
          return data.results[0].geometry.location;
      } else {
          throw new Error(`Coordinates not found for city: ${city}`);
      }
  }

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
});
