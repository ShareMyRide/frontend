import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, Alert } from 'react-native';
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Set your backend API URL here
const API_URL = 'http://192.168.216.200:2052/api/ride/start'; // Change to your actual backend URL

const AddRide = () => {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const router = useRouter();
    
  // Get params from the router
  const params = useLocalSearchParams();
  
  // Extract route data from params if available
  useEffect(() => {
    if (params.routeData) {
      try {
        const parsedData = JSON.parse(params.routeData);
        setRouteData(parsedData);
        console.log("Route data received:", parsedData);
      } catch (error) {
        console.error("Error parsing route data:", error);
      }
    }
  }, [params.routeData]);

  // Define the missing navigateToMap function
  const navigateToMap = () => {
    router.push("/map");
  };

  // This function will be called when the form is submitted
  const onFormSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Get the token from storage
      const token = await AsyncStorage.getItem('token');
      console.log("Retrieved token:", token); // Debug log
      
      // if (!token) {
      //   Alert.alert("Error", "Please login first!");
      //   router.replace("/login");
      //   return;
      // }
      
      // Check if route data is available
      if (!routeData) {
        console.error("No route data available when submitting form");
        Alert.alert("Error", "Please add ride locations first! Click the 'Add Ride Locations' button to select your route.");
        setLoading(false);
        return;
      }
      
      // Additional validation to ensure all required fields exist
      if (!routeData.startingPoint || !routeData.endingPoint || 
          !routeData.startCoordinates || !routeData.endCoordinates) {
        console.error("Incomplete route data:", routeData);
        Alert.alert("Error", "Route data is incomplete. Please select locations again.");
        setLoading(false);
        return;
      }
      
      // Your existing validation code...
      
      // Create ride data object
      const rideData = {
        date: new Date().toISOString().split('T')[0],
        startingPoint: routeData.startingPoint,
        endingPoint: routeData.endingPoint,
        startCoordinates: routeData.startCoordinates,
        endCoordinates: routeData.endCoordinates,
        distance: routeData.distance,
        routePath: routeData.routePath,
        vehicleType: values.v_type,
        vehicleNumber: values.v_number,
        availableSeats: parseInt(values.available_seats),
        contactNumber: values.contact_num,
        beginningTime: values.begin_time
      };
      
      console.log("Submitting ride data:", rideData);
      
      // Make API call with authorization header
      const response = await axios.post(
        API_URL, 
        rideData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Ride created successfully:", response.data);
      Alert.alert("Success", "Ride added successfully!");
      
      // Navigate to preview with the created ride ID
      router.replace({
        pathname: "/add-ride-preview", 
        params: { rideId: response.data._id }
      });
      
    } catch (error) {
      console.error("Error adding ride:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      let errorMessage = "Failed to add ride. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="p-4 bg-gray-300 h-screen flex items-center justify-center">
          <Text className="text-3xl font-bold text-center">Add Ride</Text>
          
          {routeData && (
            <View className="w-full p-2 bg-green-100 rounded mt-2">
              <Text className="font-bold">Selected Route:</Text>
              <Text>From: {routeData.startingPoint}</Text>
              <Text>To: {routeData.endingPoint}</Text>
              {routeData.distance && <Text>Distance: {routeData.distance}</Text>}
            </View>
          )}
          
          <Formik
            initialValues={{
              v_type: "",
              v_number: "",
              available_seats: "",
              contact_num: "",
              begin_time: ""
            }}
            onSubmit={onFormSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View className="mt-4 w-full border p-4 flex gap-4">
                <View>
                  <Pressable onPress={navigateToMap} 
                    className="mb-3 ml-14 mr-14 bg-green-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <Text className="text-white text-center">Click Here! Add Ride Locations</Text>
                  </Pressable>
                  
                  <Text className="mb-2">Vehicle Type: </Text>
                  <TextInput
                    className="border p-2 rounded"
                    onChangeText={handleChange("v_type")}
                    onBlur={handleBlur("v_type")}
                    value={values.v_type}
                    placeholder="e.g. Car, Van, Bus"
                  />
                </View>
                
                <View>
                  <Text className="mb-2">Vehicle Number: </Text>
                  <TextInput
                    className="border p-2 rounded"
                    onChangeText={handleChange("v_number")}
                    onBlur={handleBlur("v_number")}
                    value={values.v_number}
                    placeholder="e.g. ABC-1234"
                  />
                </View>
                
                <View>
                  <Text className="mb-2">Available Seats: </Text>
                  <TextInput
                    className="border p-2 rounded"
                    keyboardType="numeric"
                    onChangeText={handleChange("available_seats")}
                    onBlur={handleBlur("available_seats")}
                    value={values.available_seats}
                    placeholder="e.g. 4"
                  />
                </View>
                
                <View>
                  <Text className="mb-2">Contact Number: </Text>
                  <TextInput
                    className="border p-2 rounded"
                    keyboardType="phone-pad"
                    onChangeText={handleChange("contact_num")}
                    onBlur={handleBlur("contact_num")}
                    value={values.contact_num}
                    placeholder="e.g. 077-1234567"
                  />
                </View>
                
                <View>
                  <Text className="mb-2">Beginning Time: </Text>
                  <TextInput
                    className="border p-2 rounded"
                    onChangeText={handleChange("begin_time")}
                    onBlur={handleBlur("begin_time")}
                    value={values.begin_time}
                    placeholder="HH:MM AM/PM"
                  />
                </View>
                
                <Pressable
                  onPress={handleSubmit}
                  disabled={loading}
                  className={`${loading ? 'bg-gray-400' : 'bg-orange-600'} mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
                >
                  <Text className="text-white text-center">
                    {loading ? "Adding Ride..." : "Add Ride"}
                  </Text>
                </Pressable>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AddRide;