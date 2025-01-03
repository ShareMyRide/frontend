import React from 'react'
//import MapView from 'react-native-maps';
import { Pressable,Button, Text, View } from 'react-native';
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, router } from "expo-router";

const AddRide = () => {
  const onFormSubmit = (values) => {
    console.log(values);
    router.replace("/add-ride-preview")
  };

  return (
  <SafeAreaProvider>
        <SafeAreaView>

          <View className="p-4  bg-gray-300 h-screen flex items-center justify-center">

            <Text className="text-3xl font-bold text-center">Add Ride</Text>
            <Formik
              initialValues={{
                v_type: "",
                v_number: "",
                available_seats:"",
                contact_num: "",
                begin_time: ""
              }}
              onSubmit={onFormSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View className="mt-4 w-full border p-4 flex gap-4">
                  <View>
                    <Pressable  onPress={()=>{router.push("/map")}} 
                             className=" mb-3 ml-14 mr-14 bg-green-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                <Text className="text-white text-center" >Click Here! Add Ride Locations</Text>
                              </Pressable>
                    <Text className="mb-2 ">Vehicle Type: </Text>
                    <TextInput
                      className="border"
                      onChangeText={handleChange("v_type")}
                      onBlur={handleBlur("v_type")}
                      value={values.v_type}
                    />
                  </View>
                  <View>
                    <Text className="mb-2">Vehicle Number : </Text>
                    <TextInput
                      className="border"
                      onChangeText={handleChange("v_number")}
                      onBlur={handleBlur("v_number")}
                      value={values.v_number}
                    />
                  </View>
                  <View>
                    <Text className="mb-2">Available Seats : </Text>
                    <TextInput
                      className="border"
                      onChangeText={handleChange("available_seats")}
                      onBlur={handleBlur("available_seats")}
                      value={values.available_seats}
                    />
                  </View>
                  <View>
                    <Text className="mb-2">Contact Number : </Text>
                    <TextInput
                      className="border"
                      onChangeText={handleChange("contact_num")}
                      onBlur={handleBlur("contact_num")}
                      value={values.contact_num}
                    />
                  </View>
                  <View>
                    <Text className="mb-2">Beginning Time : </Text>
                    <TextInput
                      className="border"
                      onChangeText={handleChange("begin_time")}
                      onBlur={handleBlur("begin_time")}
                      value={values.begin_time}
                    />
                  </View>
                  <Pressable
                                    onPress={() => {
                                      router.push("/add-ride-preview");
                                    }}
                                    className="bg-orange-600 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                  >
                                    <Text className="text-white text-center">Add Ride</Text>
                                  </Pressable>
                
                </View>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>

  )
}
export default AddRide;