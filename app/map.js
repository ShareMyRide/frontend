import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

// Your Google Maps API Key (Replace with real value)
const GOOGLE_MAPS_API_KEY =  process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
  map: {
    flex: 1,
  },
});
