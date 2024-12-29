import React from "react";
import { Pressable, Button, Text, View } from "react-native";
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import { Link,router } from "expo-router";

const register = () => {
  const onFormSubmit = (values) => {
    console.log(values);
    router.replace("/dashboard")
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="m-4 h-screen flex items-center justify-center">
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
                <Button onPress={handleSubmit} title="Submit" />
              
                <Link href="/login" asChild>
                  <Pressable>
                    <Text>Already have an account ?</Text>
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

