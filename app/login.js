import React from "react";
import { Pressable,Button, Text, View,StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const router = useRouter();

  const onFormSubmit = async (values) => {
    try {

      console.log("Submitting login values:", values);
      //const response = await axios.post("http://localhost:2052/api/auth/login", {
      const response = await axios.post("http://192.168.216.78:2052/api/auth/login", {

        
        email: values.email,
        password: values.pswrd,
      });
      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", user.id);

      console.log("Login successful:", response.data);
      alert("Login successful!");
      router.replace("/dashboard"); 
    } catch (error) {
      if (error.response) {
        
        console.error("Login failed:", error.response.data.message);
        alert(error.response.data.message || "Login failed");
      } else {
       
        console.error("Error during login:", error.message);
        alert("An error occurred. Please try again.");
      }
    }

  };

  return (
     <LinearGradient
              colors={['#f97316', 'white']}
              style={styles.container}
              start={{ x: 1.5, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
    <SafeAreaProvider>
      <SafeAreaView>
        <View
          className="p-4 h-screen flex items-center justify-center"
        >
          <Text className="text-4xl font-bold text-center">Login</Text>
          <Formik
            initialValues={{
              email: "",
              pswrd: "",
            }}
            onSubmit={onFormSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View className="mt-4 w-full border p-5 flex gap-4">
                <View>
                  <Text className="mb-2" style={styles.textLabel}>E-mail: </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                </View>
                <View>
                  <Text className="mb-2" style={styles.textLabel}>Password : </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("pswrd")}
                    onBlur={handleBlur("pswrd")}
                    value={values.pswrd}
                  />
                </View>
                <View style={styles.buttonContainer}>
                <Button onPress={handleSubmit} title="Submit"  />
                </View>
                
                <Link href="/register" asChild>

                  <Text>Haven't an account? Create Account</Text>

                </Link>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({

  buttonContainer:{
    backgroundColor: "black"
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", 
    padding: 20,
  },
})

export default login;
