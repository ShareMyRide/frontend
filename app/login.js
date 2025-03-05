import React from "react";
import { Pressable,Button, Text, View } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, useRouter } from "expo-router";
const login = () => {
  const router = useRouter();

  const onFormSubmit = async (values) => {
    try {
      console.log("Submitting login values:", values);
      const response = await axios.post("http://localhost:2052/api/auth/login", {
     // const response = await axios.post("http://192.168.132.78:2052/api/auth/login", {
        email: values.email,
        password: values.pswrd,
      });

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
    <SafeAreaProvider>
      <SafeAreaView>
        <View
          className="p-4 h-screen flex items-center justify-center
         bg-gray-300"
        >
          <Text className="text-3xl font-bold text-center">Login</Text>
          <Formik
            initialValues={{
              email: "",
              pswrd: "",
            }}
            onSubmit={onFormSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View className="mt-4 w-full border p-4 flex gap-4">
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
                  <Text className="mb-2">Password : </Text>
                  <TextInput
                    className="border"
                    onChangeText={handleChange("pswrd")}
                    onBlur={handleBlur("pswrd")}
                    value={values.pswrd}
                  />
                </View>
                <Pressable
                                  onPress={() => {
                                    router.push("/dashboard");
                                  }}
                                  className="bg-orange-600 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                  <Text className="text-white text-center">SUBMIT</Text>
                                </Pressable>
                <Link href="/register" asChild>
                  <Text className="underline">Haven't an account? Create Account</Text>
                </Link>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default login;
