import React, { useState } from 'react';
import { Pressable, Button, Text, View, Alert } from 'react-native';
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, router } from "expo-router";
import axios from 'axios'; // Make sure axios is installed

// Set your backend API URL here
const API_URL = 'http://192.168.216.200:2052/api'; // Change to your actual backend URL

const AddRide = () => {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);

  // This function will be called when the form is submitted
  const onFormSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Check if route data is available
      if (!routeData) {
        Alert.alert("Error", "Please add ride locations first!");
        setLoading(false);
        return;
      }
      
      // Create ride data object combining form values and route data
      const rideData = {
        date: new Date().toISOString().split('T')[0], // Current date as default
        startingPoint: routeData.startingPoint,
        endingPoint: routeData.endingPoint,
        vehicleType: values.v_type,
        vehicleNumber: values.v_number,
        availableSeats: values.available_seats,
        contactNumber: values.contact_num,
        beginningTime: values.begin_time
      };
      
      console.log("Submitting ride data:", rideData);
      
      // Submit to backend API
      const response = await axios.post(`${API_URL}/rides/start`, rideData);
      
      console.log("Ride created successfully:", response.data);
      Alert.alert("Success", "Ride added successfully!");
      
      // Navigate to preview page with the created ride data
      router.replace({
        pathname: "/add-ride-preview", 
        params: { rideId: response.data._id }
      });
      
    } catch (error) {
      console.error("Error adding ride:", error);
      Alert.alert(
        "Error", 
        error.response?.data || "Failed to add ride. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // This function will be called when returning from the map screen
  const handleMapReturn = (data) => {
    // This should be called when the user returns from the map screen
    setRouteData(data);
  };

  // Navigate to map screen
  const navigateToMap = () => {
    router.push({
      pathname: "/map",
      params: { 
        returnRoute: "add-ride",
        onReturn: handleMapReturn 
      }
    });
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
                  />
                </View>
                
                <View>
                  <Text className="mb-2">Vehicle Number: </Text>
                  <TextInput
                    className="border p-2 rounded"
                    onChangeText={handleChange("v_number")}
                    onBlur={handleBlur("v_number")}
                    value={values.v_number}
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