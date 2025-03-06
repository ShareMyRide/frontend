import React from "react";
import { Pressable,Button, Text, View, StyleSheet} from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const login = () => {


  const onFormSubmit = async (values) => {
    // try {
      console.log("Submitting login values:", values);


      // const response = await fetch("http://localhost:2052/api/auth/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: values.email,
      //     password: values.pswrd,
      //   }),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error("Login failed:", errorData.message);
      //   alert(errorData.message || "Login failed");
      //   return;
      // }


      // const data = await response.json();
      // console.log("Login successful:", data);
      // alert("Login successful!");
      router.replace("/dashboard");

    // } catch (error) {
    //   console.error("Error during login:", error);
    //   alert("An error occurred. Please try again.");
    // }
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
                  <Text className="mb-2" >Password : </Text>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default login;
