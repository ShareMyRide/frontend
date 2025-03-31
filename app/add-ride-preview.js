import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL
// Set your backend API URL here
const API_URL = `http://${BACKEND_URL}:2052/api/ride`; // Change to your actual backend URL

export default function UserRidesPreview() {
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUserRides();
  }, []);
  
  const fetchUserRides = async () => {
    try {
      setLoading(true);
      
      // Get the token from storage
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login.');
        setLoading(false);
        return;
      }
      
      // Use the endpoint for getting all rides by the logged-in user
      // You'll need to create this endpoint on your backend if it doesn't exist
      const response = await axios.get(`${API_URL}/user/rides`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("User rides received:", response.data);
      setRides(response.data);
    } catch (error) {
      console.error('Error fetching user rides:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      setError(error.response?.data?.message || 'Failed to load your rides');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoBack = () => {
    router.push('/dashboard');
  };
  
  const handleEditRide = (rideId) => {
    router.push({
      pathname: '/add-ride',
      params: { editRideId: rideId }
    });
  };
  
  const handleViewRideDetails = (rideId) => {
    router.push({
      pathname: '/ride-details',
      params: { rideId: rideId }
    });
  };
  
  const renderRideCard = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>From:</Text>
        <Text style={styles.detailValue}>{item.startingPoint}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>To:</Text>
        <Text style={styles.detailValue}>{item.endingPoint}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Date:</Text>
        <Text style={styles.detailValue}>{item.date}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Time:</Text>
        <Text style={styles.detailValue}>{item.beginningTime}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.viewButton]} 
          onPress={() => handleViewRideDetails(item._id)}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => handleEditRide(item._id)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading your rides...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  
  if (error) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.button} onPress={handleGoBack}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Your Rides</Text>
        
        {rides.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't created any rides yet.</Text>
            <TouchableOpacity 
              style={[styles.button, styles.createButton]} 
              onPress={() => router.push('/add-ride')}
            >
              <Text style={styles.buttonText}>Create a Ride</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={rides}
            renderItem={renderRideCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.rideList}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.addButton]} 
            onPress={() => router.push('/add-ride')}
          >
            <Text style={styles.buttonText}>Add New Ride</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.homeButton]} 
            onPress={handleGoBack}
          >
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  rideList: {
    paddingBottom: 80,
  },
  rideCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  viewButton: {
    backgroundColor: '#007bff',
  },
  editButton: {
    backgroundColor: '#f0ad4e',
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 32,
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  homeButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});