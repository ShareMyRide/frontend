import React from "react";
import { Pressable, Button, Text, View } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, router } from "expo-router";
import axios from "axios";

const register = () => {
  const onFormSubmit = async (values) => {
    console.log(values);
    try {
      // const response = await fetch("http://localhost:2052/api/auth/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     firstname: values.fname,
      //     lastname: values.lname,
      //     email: values.email,
      //     NIC: values.nic,
      //     password: values.pswrd,
      //     confirmPassword: values.confPswrd,
      //     mobileNumber: "1234567890", // Placeholder, update as needed
      //   }),
      // });

      const response = await axios.post(
        "http://localhost:2052/api/auth/register",
        {
          firstname: values.fname,
          lastname: values.lname,
          email: values.email,
          NIC: values.nic,
          password: values.pswrd,
          confirmPassword: values.confPswrd,
          mobileNumber: "1234567890",
        }
      );

      console.log(response.data);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData.message);
        alert(errorData.message || "Registration failed");
        return;
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      alert("Registration successful");
      router.replace("/login");
    } catch (error) {
      console.error("Error during registration:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="p-4 h-screen flex items-center justify-center  bg-gray-400">
          <Text className="text-3xl font-bold text-center">Register</Text>
          <Formik
            initialValues={{
              fname: "",
              lname: "",
              email: "",
              nic: "",
              pswrd: "",
              confPswrd: "",
            }}
            onSubmit={onFormSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View className="mt-4 w-full border p-4 flex gap-4">
                <View>
                  <Text className="mb-2">First Name: </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("fname")}
                    onBlur={handleBlur("fname")}
                    value={values.fname}
                  />
                </View>
                <View>
                  <Text className="mb-2">Last Name: </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("lname")}
                    onBlur={handleBlur("lname")}
                    value={values.lname}
                  />
                </View>
                <View>
                  <Text className="mb-2">E-mail: </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                </View>
                <View>
                  <Text className="mb-2">NIC number: </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("nic")}
                    onBlur={handleBlur("nic")}
                    value={values.nic}
                  />
                </View>
                <View>
                  <Text className="mb-2">Password : </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("pswrd")}
                    onBlur={handleBlur("pswrd")}
                    value={values.pswrd}
                  />
                </View>
                <View>
                  <Text className="mb-2"> Confirm Password :</Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("confPswrd")}
                    onBlur={handleBlur("confPswrd")}
                    value={values.confPswrd}
                  />
                </View>
              

                <Pressable
                  onPress={() => {
                    router.push("/login");
                  }}
                  className="bg-orange-600 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  <Text className="text-white text-center">SUBMIT</Text>
                </Pressable>

                <Link href="/login" asChild>
                  <Pressable>
                    <Text className="underline">Already have an account ?</Text>
                  </Pressable>
                </Link>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default register;
