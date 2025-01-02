import React from 'react'
//import MapView from 'react-native-maps';
import { Button, Text, View } from 'react-native';
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, router } from "expo-router";

const AddRide = () => {
  const onFormSubmit = (values) => {
    console.log(values);
    router.replace("/")
  };

  return (
  <SafeAreaProvider>
        <SafeAreaView>
          <View className="m-4 h-screen flex items-center justify-center">
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
                    <Text className="mb-2">Vehicle Type: </Text>
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
                  <Button onPress={handleSubmit} title="Submit" />
                
                </View>
              )}
            </Formik>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
  )
}
export default AddRide;