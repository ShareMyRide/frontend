import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import MapView, { Marker, Polyline } from 'react-native-maps';

const BACKEND_URL = process.env.BACKEND_URL
// Set your backend API URL here
const API_URL = `http://${BACKEND_URL}:2052`; // Change to your actual backend URL

const FindRide = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 7.8731,  // Default to Sri Lanka
    longitude: 80.7718,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });
  
  // Google Maps API Key
  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

  useEffect(() => {
    // Fetch all available rides when component mounts
    fetchAllRides();
  }, []);

  const fetchAllRides = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert("Error", "Please login first!");
        router.replace("/login");
        return;
      }
      
      const response = await axios.get(
        `${API_URL}/api/ride/all`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        setRides(response.data);
        console.log(`Fetched ${response.data.length} rides`);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
      Alert.alert("Error", "Failed to fetch available rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Geocode a location name to coordinates
  const geocodeLocation = async (locationName) => {
    try {
      // Try with Google Maps Geocoding API first
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&region=lk&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
          display_name: result.formatted_address
        };
      }
      
      // Fallback to Nominatim if Google fails
      const searchQuery = `${locationName}, Sri Lanka`;
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
      
      const nominatimResponse = await axios.get(nominatimUrl, {
        headers: {
          'User-Agent': 'RideShareApp/1.0'
        }
      });
      
      if (nominatimResponse.data && nominatimResponse.data.length > 0) {
        return {
          latitude: parseFloat(nominatimResponse.data[0].lat),
          longitude: parseFloat(nominatimResponse.data[0].lon),
          display_name: nominatimResponse.data[0].display_name
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
        'jaffna': { latitude: 9.6613, longitude: 80.0255, display_name: 'Jaffna, Sri Lanka' },
        'gampaha': { latitude: 7.0917, longitude: 80.0000, display_name: 'Gampaha, Sri Lanka' }
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

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  // Check if a point is along a route (within a reasonable distance)
  const isPointNearRoute = (point, routePath) => {
    if (!routePath || routePath.length < 2) return false;
    
    const threshold = 2; // km - maximum distance to be considered "near" the route
    
    // For each segment of the route, check if point is near it
    for (let i = 0; i < routePath.length - 1; i++) {
      const segmentStart = routePath[i];
      const segmentEnd = routePath[i + 1];
      
      // Calculate distance from point to this segment
      const distance = distanceToSegment(point, segmentStart, segmentEnd);
      
      if (distance <= threshold) {
        return true;
      }
    }
    
    return false;
  };
  
  // Calculate distance from point to line segment
  const distanceToSegment = (point, segmentStart, segmentEnd) => {
    // Convert point
    const p = { 
      lat: point.latitude || point[0], 
      lon: point.longitude || point[1] 
    };
    
    // Convert segment points
    const s1 = { 
      lat: segmentStart.latitude || segmentStart[0], 
      lon: segmentStart.longitude || segmentStart[1] 
    };
    const s2 = { 
      lat: segmentEnd.latitude || segmentEnd[0], 
      lon: segmentEnd.longitude || segmentEnd[1] 
    };
    
    // Calculate distances
    const distanceToStart = calculateDistance(p.lat, p.lon, s1.lat, s1.lon);
    const distanceToEnd = calculateDistance(p.lat, p.lon, s2.lat, s2.lon);
    const segmentLength = calculateDistance(s1.lat, s1.lon, s2.lat, s2.lon);
    
    // If segment is very short, just return distance to either endpoint
    if (segmentLength < 0.1) {
      return Math.min(distanceToStart, distanceToEnd);
    }
    
    // Use vector projection to determine if point is alongside the segment
    // This is a simplified calculation that works for small distances
    const dotProduct = ((p.lat - s1.lat) * (s2.lat - s1.lat) + 
                        (p.lon - s1.lon) * (s2.lon - s1.lon));
    const projectionRatio = dotProduct / (segmentLength * segmentLength);
    
    if (projectionRatio < 0) {
      return distanceToStart; // Point is beyond the start of the segment
    }
    if (projectionRatio > 1) {
      return distanceToEnd; // Point is beyond the end of the segment
    }
    
    // Point is alongside the segment, calculate perpendicular distance
    // This is an approximation that works well enough for short distances
    const projLat = s1.lat + projectionRatio * (s2.lat - s1.lat);
    const projLon = s1.lon + projectionRatio * (s2.lon - s1.lon);
    return calculateDistance(p.lat, p.lon, projLat, projLon);
  };

  // Filter rides based on start and end locations
  const filterRides = async () => {
    if (!startLocation || !endLocation) {
      Alert.alert("Error", "Please enter both start and end locations");
      return;
    }
    
    try {
      setLoading(true);
      
      // Get coordinates for start and end locations
      const startCoord = await geocodeLocation(startLocation);
      const endCoord = await geocodeLocation(endLocation);
      
      if (!startCoord || !endCoord) {
        Alert.alert("Error", "Could not find coordinates for one or both locations");
        setLoading(false);
        return;
      }
      
      setStartCoords(startCoord);
      setEndCoords(endCoord);
      
      // Update map region to show both points
      const midLat = (startCoord.latitude + endCoord.latitude) / 2;
      const midLng = (startCoord.longitude + endCoord.longitude) / 2;
      const latDelta = Math.abs(startCoord.latitude - endCoord.latitude) * 1.5;
      const lngDelta = Math.abs(startCoord.longitude - endCoord.longitude) * 1.5;
      
      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(0.05, latDelta),
        longitudeDelta: Math.max(0.05, lngDelta),
      });
      
      // If no rides have been fetched yet, do it now
      if (rides.length === 0) {
        await fetchAllRides();
      }
      
      // Now filter rides based on route proximity
      const matchingRides = rides.filter(ride => {
        // Check if ride has necessary data
        if (!ride.startCoordinates || !ride.endCoordinates || !ride.routePath) {
          return false;
        }
        
        try {
          // Parse route data if it's stored as a string
          const routePath = typeof ride.routePath === 'string' 
            ? JSON.parse(ride.routePath) 
            : ride.routePath;
            
          // Check if requested start point is near the ride route
          const isStartNearRoute = isPointNearRoute(
            { latitude: startCoord.latitude, longitude: startCoord.longitude },
            routePath
          );
          
          // Check if requested end point is near the ride route
          const isEndNearRoute = isPointNearRoute(
            { latitude: endCoord.latitude, longitude: endCoord.longitude },
            routePath
          );
          
          // Direction matters - check if start is before end along the route
          if (isStartNearRoute && isEndNearRoute) {
            // Find closest points on route to start and end
            let startIndex = -1;
            let endIndex = -1;
            let minStartDist = Infinity;
            let minEndDist = Infinity;
            
            for (let i = 0; i < routePath.length; i++) {
              const point = routePath[i];
              
              const distToStart = calculateDistance(
                startCoord.latitude, startCoord.longitude,
                point.latitude || point[0], point.longitude || point[1]
              );
              
              const distToEnd = calculateDistance(
                endCoord.latitude, endCoord.longitude,
                point.latitude || point[0], point.longitude || point[1]
              );
              
              if (distToStart < minStartDist) {
                minStartDist = distToStart;
                startIndex = i;
              }
              
              if (distToEnd < minEndDist) {
                minEndDist = distToEnd;
                endIndex = i;
              }
            }
            
            // Check if start is before end on the route
            return startIndex <= endIndex;
          }
          
          return false;
        } catch (error) {
          console.error("Error processing ride:", error);
          return false;
        }
      });
      
      setFilteredRides(matchingRides);
      setSearchPerformed(true);
      console.log(`Found ${matchingRides.length} matching rides`);
    } catch (error) {
      console.error("Error filtering rides:", error);
      Alert.alert("Error", "Failed to search for rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Show ride details on map when selected
  const showRideOnMap = (ride) => {
    setSelectedRide(ride);
    
    try {
      // Parse route path if needed
      const routePath = typeof ride.routePath === 'string' 
        ? JSON.parse(ride.routePath) 
        : ride.routePath;
      
      // Get start and end coordinates
      const startCoord = typeof ride.startCoordinates === 'string'
        ? JSON.parse(ride.startCoordinates)
        : ride.startCoordinates;
        
      const endCoord = typeof ride.endCoordinates === 'string'
        ? JSON.parse(ride.endCoordinates)
        : ride.endCoordinates;
      
      // Format coordinates for map
      const formattedPath = routePath.map(point => ({
        latitude: point.latitude || point[0],
        longitude: point.longitude || point[1]
      }));
      
      // Update map to show the route
      if (formattedPath.length > 0) {
        const lats = formattedPath.map(p => p.latitude);
        const lngs = formattedPath.map(p => p.longitude);
        
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        const midLat = (minLat + maxLat) / 2;
        const midLng = (minLng + maxLng) / 2;
        const latDelta = (maxLat - minLat) * 1.5;
        const lngDelta = (maxLng - minLng) * 1.5;
        
        setMapRegion({
          latitude: midLat,
          longitude: midLng,
          latitudeDelta: Math.max(0.05, latDelta),
          longitudeDelta: Math.max(0.05, lngDelta),
        });
      }
    } catch (error) {
      console.error("Error showing ride on map:", error);
      Alert.alert("Error", "Could not display ride route on map");
    }
  };
  
  // Request to join a ride
  const requestToJoinRide = async (rideId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert("Error", "Please login first!");
        router.replace("/login");
        return;
      }
      
      // Prepare request data
      const requestData = {
        pickupPoint: startLocation,
        dropoffPoint: endLocation,
        pickupCoordinates: [startCoords.latitude, startCoords.longitude],
        dropoffCoordinates: [endCoords.latitude, endCoords.longitude]
      };
      
      // Send request to join ride
      const response = await axios.post(
        `${API_URL}/api/ride/request/${rideId}`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Join request response:", response.data);
      
      Alert.alert(
        "Success",
        "Your request to join this ride has been sent to the driver.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error requesting to join ride:", error);
      
      let errorMessage = "Failed to request ride. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Error", errorMessage);
    }
  };
  
  // Render each ride item in the list
  const renderRideItem = ({ item }) => {
    // Format date
    const rideDate = new Date(item.date);
    const formattedDate = rideDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <TouchableOpacity 
        style={styles.rideItem}
        onPress={() => showRideOnMap(item)}
      >
        <View style={styles.rideHeader}>
          <Text style={styles.rideRoute}>
            {item.startingPoint} → {item.endingPoint}
          </Text>
          <Text style={styles.rideTime}>
            {item.beginningTime} · {formattedDate}
          </Text>
        </View>
        
        <View style={styles.rideDetails}>
          <Text>Driver:{ item.driverName || "Unknown"}</Text>
          <Text>Vehicle: {item.vehicleType} ({item.vehicleNumber})</Text>
          <Text>Available Seats: {item.availableSeats}</Text>
          {item.distance && <Text>Distance: {item.distance}</Text>}
        </View>
        
        <TouchableOpacity 
          style={styles.joinButton}
          onPress={() => requestToJoinRide(item._id)}
        >
          <Text style={styles.joinButtonText}>Request to Join</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Find a Ride</Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Starting Point:</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Colombo"
                value={startLocation}
                onChangeText={setStartLocation}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Destination:</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kandy"
                value={endLocation}
                onChangeText={setEndLocation}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={filterRides}
              disabled={loading}
            >
              <Text style={styles.searchButtonText}>
                {loading ? "Searching..." : "Find Rides"}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
            >
              {startCoords && (
                <Marker
                  coordinate={{
                    latitude: startCoords.latitude,
                    longitude: startCoords.longitude
                  }}
                  title="Your Start"
                  pinColor="green"
                />
              )}
              
              {endCoords && (
                <Marker
                  coordinate={{
                    latitude: endCoords.latitude,
                    longitude: endCoords.longitude
                  }}
                  title="Your Destination"
                  pinColor="red"
                />
              )}
              
              {selectedRide && selectedRide.routePath && (
                <Polyline
                  coordinates={
                    typeof selectedRide.routePath === 'string'
                      ? JSON.parse(selectedRide.routePath).map(point => ({
                          latitude: point.latitude || point[0],
                          longitude: point.longitude || point[1]
                        }))
                      : selectedRide.routePath.map(point => ({
                          latitude: point.latitude || point[0],
                          longitude: point.longitude || point[1]
                        }))
                  }
                  strokeWidth={4}
                  strokeColor="#00F"
                />
              )}
              
              {selectedRide && selectedRide.startCoordinates && (
                <Marker
                  coordinate={{
                    latitude: typeof selectedRide.startCoordinates === 'string'
                      ? JSON.parse(selectedRide.startCoordinates)[0]
                      : (selectedRide.startCoordinates.latitude || selectedRide.startCoordinates[0]),
                    longitude: typeof selectedRide.startCoordinates === 'string'
                      ? JSON.parse(selectedRide.startCoordinates)[1]
                      : (selectedRide.startCoordinates.longitude || selectedRide.startCoordinates[1])
                  }}
                  title="Ride Start"
                  pinColor="blue"
                />
              )}
              
              {selectedRide && selectedRide.endCoordinates && (
                <Marker
                  coordinate={{
                    latitude: typeof selectedRide.endCoordinates === 'string'
                      ? JSON.parse(selectedRide.endCoordinates)[0]
                      : (selectedRide.endCoordinates.latitude || selectedRide.endCoordinates[0]),
                    longitude: typeof selectedRide.endCoordinates === 'string'
                      ? JSON.parse(selectedRide.endCoordinates)[1]
                      : (selectedRide.endCoordinates.longitude || selectedRide.endCoordinates[1])
                  }}
                  title="Ride End"
                  pinColor="purple"
                />
              )}
            </MapView>
          </View>
          
          <View style={styles.resultsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#d32f2f" />
                <Text style={styles.loadingText}>Searching for rides...</Text>
              </View>
            ) : searchPerformed ? (
              filteredRides.length > 0 ? (
                <FlatList
                  data={filteredRides}
                  renderItem={renderRideItem}
                  keyExtractor={item => item._id}
                  contentContainerStyle={styles.ridesList}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No matching rides found</Text>
                  <Text style={styles.noResultsSubtext}>Try different locations or check back later</Text>
                </View>
              )
            ) : (
              <View style={styles.initialStateContainer}>
                <Text style={styles.initialStateText}>Enter your starting point and destination to find rides</Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  searchButton: {
    backgroundColor: '#d32f2f',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  map: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  ridesList: {
    padding: 12,
  },
  rideItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  rideHeader: {
    marginBottom: 8,
  },
  rideRoute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rideTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rideDetails: {
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});


export default FindRide;