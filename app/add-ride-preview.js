import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

// Set your backend API URL here
const API_URL = 'http://your-backend-url/api'; // Change to your actual backend URL

export default function AddRidePreview() {
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  
  const params = useLocalSearchParams();
  const rideId = params.rideId;
  
  useEffect(() => {
    fetchRideDetails();
  }, [rideId]);
  
  const fetchRideDetails = async () => {
    if (!rideId) {
      setError('No ride ID provided');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/rides/${rideId}`);
      setRide(response.data);
    } catch (error) {
      console.error('Error fetching ride details:', error);
      setError(error.response?.data?.error || 'Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoBack = () => {
    router.push('/');
  };
  
  const handleEditRide = () => {
    // Navigate back to add-ride with the ride data for editing
    router.push({
      pathname: '/add-ride',
      params: { editRideId: rideId }
    });
  };
  
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading ride details...</Text>
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
        <Text style={styles.title}>Ride Added Successfully!</Text>
        
        <View style={styles.rideDetailsCard}>
          <Text style={styles.sectionTitle}>Ride Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>From:</Text>
            <Text style={styles.detailValue}>{ride?.startingPoint}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>To:</Text>
            <Text style={styles.detailValue}>{ride?.endingPoint}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{ride?.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{ride?.beginningTime}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle:</Text>
            <Text style={styles.detailValue}>{ride?.vehicleType} ({ride?.vehicleNumber})</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Available Seats:</Text>
            <Text style={styles.detailValue}>{ride?.availableSeats}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{ride?.contactNumber}</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditRide}>
            <Text style={styles.buttonText}>Edit Ride</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.doneButton]} onPress={handleGoBack}>
            <Text style={styles.buttonText}>Done</Text>
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
  rideDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
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
  detailValue