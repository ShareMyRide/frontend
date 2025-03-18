import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';

// Your Google Maps API Key (Replace with real value)
const GOOGLE_MAPS_API_KEY = "AIzaSyAiQ_WJER_3HDCs0B6tH01WPTCzB1COSLA";

export default function map() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 7.8731,  // Default to Sri Lanka
    longitude: 80.7718,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });
  
  // Get params from the router
  const params = useLocalSearchParams();
  const returnRoute = params.returnRoute;

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      // Get current location
      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        // Update map region to center on current location
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Could not get your current location');
      }
    })();
  }, []);

  // Geocode a location name to coordinates
  const geocodeLocation = async (locationName) => {
    try {
      // First try with Nominatim (OpenStreetMap) which doesn't require API key
      const searchQuery = `${locationName}, Sri Lanka`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'RideShareApp/1.0'
        }
      });
      
      if (response.data && response.data.length > 0) {
        return {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon),
          display_name: response.data[0].display_name
        };
      } else {
        throw new Error(`No results found for: ${locationName}`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      
      // Fallback for common Sri Lankan cities
      const fallbackCoordinates = {
        'colombo': { latitude: 6.9271, longitude: 79.8612, display_name: 'Colombo, Sri Lanka' },
        'kandy': { latitude: 7.2906, longitude: 80.6337, display_name: 'Kandy, Sri Lanka' },
        'galle': { latitude: 6.0328, longitude: 80.2170, display_name: 'Galle, Sri Lanka' },
        'jaffna': { latitude: 9.6613, longitude: 80.0255, display_name: 'Jaffna, Sri Lanka' }
      };
      
      // Check if there's a fallback for this location
      const key = locationName.toLowerCase().trim();
      if (fallbackCoordinates[key]) {
        console.log(`Using fallback coordinates for ${locationName}`);
        return fallbackCoordinates[key];
      }
      
      Alert.alert('Error', `Could not find coordinates for ${locationName}`);
      return null;
    }
  };

  // Set start location
  const handleSetStartLocation = async () => {
    if (!startLocation.trim()) {
      Alert.alert('Error', 'Please enter a starting location');
      return;
    }
    
    const coords = await geocodeLocation(startLocation);
    if (coords) {
      setStartCoords(coords);
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  // Set end location
  const handleSetEndLocation = async () => {
    if (!endLocation.trim()) {
      Alert.alert('Error', 'Please enter an ending location');
      return;
    }
    
    const coords = await geocodeLocation(endLocation);
    if (coords) {
      setEndCoords(coords);
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  // Calculate route between start and end
  const calculateRoute = async () => {
    if (!startCoords || !endCoords) {
      Alert.alert('Error', 'Please set both start and end locations');
      return;
    }
    
    try {
      // Simple direct line for now (in a real app you'd use a routing API)
      setRouteCoordinates([
        { latitude: startCoords.latitude, longitude: startCoords.longitude },
        { latitude: endCoords.latitude, longitude: endCoords.longitude }
      ]);
      
      // Adjust map to show the entire route
      const midLat = (startCoords.latitude + endCoords.latitude) / 2;
      const midLng = (startCoords.longitude + endCoords.longitude) / 2;
      const latDelta = Math.abs(startCoords.latitude - endCoords.latitude) * 1.5;
      const lngDelta = Math.abs(startCoords.longitude - endCoords.longitude) * 1.5;
      
      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(0.05, latDelta),
        longitudeDelta: Math.max(0.05, lngDelta),
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      Alert.alert('Error', 'Failed to calculate route');
    }
  };

  // Confirm selection and return to previous screen
  const confirmSelection = () => {
    if (!startCoords || !endCoords) {
      Alert.alert('Error', 'Please set both start and end locations');
      return;
    }
    
    // Prepare data to return
    const routeData = {
      startingPoint: startCoords.display_name.split(',')[0],
      endingPoint: endCoords.display_name.split(',')[0],
      startCoordinates: [startCoords.latitude, startCoords.longitude],
      endCoordinates: [endCoords.latitude, endCoords.longitude]
    };
    
    // Return to the calling screen with data
    if (returnRoute === 'add-ride') {
      router.navigate({
        pathname: '/add-ride',
        params: { routeData: JSON.stringify(routeData) }
      });
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter starting location"
          value={startLocation}
          onChangeText={setStartLocation}
        />
        <TouchableOpacity style={styles.button} onPress={handleSetStartLocation}>
          <Text style={styles.buttonText}>Set Start</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={endLocation}
          onChangeText={setEndLocation}
        />
        <TouchableOpacity style={styles.button} onPress={handleSetEndLocation}>
          <Text style={styles.buttonText}>Set End</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={mapRegion}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="You are here"
            pinColor="blue"
          />
        )}
        
        {startCoords && (
          <Marker
            coordinate={{
              latitude: startCoords.latitude,
              longitude: startCoords.longitude
            }}
            title="Start"
            pinColor="green"
          />
        )}
        
        {endCoords && (
          <Marker
            coordinate={{
              latitude: endCoords.latitude,
              longitude: endCoords.longitude
            }}
            title="End"
            pinColor="red"
          />
        )}
        
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="#00F"
          />
        )}
      </MapView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.calculateButton]} 
          onPress={calculateRoute}
        >
          <Text style={styles.buttonText}>Calculate Route</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.confirmButton]} 
          onPress={confirmSelection}
        >
          <Text style={styles.buttonText}>Confirm Selection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  map: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#34A853',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#EA4335',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});