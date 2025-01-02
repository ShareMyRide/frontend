import React from "react";
import { Button, Text, View } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link, router } from "expo-router";
const login = () => {
  const onFormSubmit = (values) => {
    console.log(values);
    router.replace("/dashboard")
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="m-4 h-screen flex items-center justify-center">
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
                <Button onPress={handleSubmit} title="Submit" />
                <Link href="/register" asChild>
                  <Text>Haven't an account? Create Account</Text>
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
