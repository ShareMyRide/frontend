import React from 'react';
import { Pressable, Button, Text, View, StyleSheet } from 'react-native';
import { TextInput } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from 'yup'; // Add Yup for validation
import { Link, useRouter } from "expo-router";
import axios from 'axios';
import { LinearGradient } from "expo-linear-gradient";

const BACKEND_URL = process.env.BACKEND_URL;

// Validation Schema
const RegistrationSchema = Yup.object().shape({
  fname: Yup.string()
    .min(2, 'First name is too short')
    .max(50, 'First name is too long')
    .required('First name is required'),
  lname: Yup.string()
    .min(2, 'Last name is too short')
    .max(50, 'Last name is too long')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  nic: Yup.string()
    .matches(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, 'Invalid NIC format')
    .required('NIC is required'),
  pswrd: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confPswrd: Yup.string()
    .oneOf([Yup.ref('pswrd')], 'Passwords must match')
    .required('Confirm password is required'),
});

const register = () => {
  const router = useRouter();

  const onFormSubmit = async (values) => {
    try {
      const response = await axios.post(`http://${BACKEND_URL}:2052/api/auth/register`, {
        firstname: values.fname,
        lastname: values.lname,
        email: values.email,
        NIC: values.nic,
        password: values.pswrd,
        confirmPassword: values.confPswrd,
      });

      console.log("Registration successful:", response.data);
      alert("Registration successful");
      router.replace("/login");
    } catch (error) {
      if (error.response) {
        console.error("Registration failed:", error.response.data.message);
        alert(error.response.data.message || "Registration failed");
      } else {
        console.error("Error during registration:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <LinearGradient
      colors={["#f97316", "white"]}
      style={styles.container}
      start={{ x: 1.5, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaProvider>
        <SafeAreaView>
          <View className="p-4 h-screen flex items-center justify-center">
            <Text className="text-4xl font-bold text-center">Register</Text>
            <Formik
              initialValues={{
                fname: "",
                lname: "",
                email: "",
                nic: "",
                pswrd: "",
                confPswrd: "",
              }}
              validationSchema={RegistrationSchema}
              onSubmit={onFormSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View className="mt-4 w-full border p-4 flex gap-4">
                  <View>
                    <Text className="mb-2" style={styles.textLabel}>
                      First Name:{" "}
                    </Text>
                    <TextInput
                      className="border1"
                      onChangeText={handleChange("fname")}
                      onBlur={handleBlur("fname")}
                      value={values.fname}
                      style={touched.fname && errors.fname ? styles.inputError : styles.input}
                    />
                    {touched.fname && errors.fname && (
                      <Text style={styles.errorText}>{errors.fname}</Text>
                    )}
                  </View>
                  <View>
                    <Text className="mb-2" style={styles.textLabel}>
                      Last Name:{" "}
                    </Text>
                    <TextInput
                      className="border1"
                      onChangeText={handleChange("lname")}
                      onBlur={handleBlur("lname")}
                      value={values.lname}
                      style={touched.lname && errors.lname ? styles.inputError : styles.input}
                    />
                    {touched.lname && errors.lname && (
                      <Text style={styles.errorText}>{errors.lname}</Text>
                    )}
                  </View>
                  <View>
                    <Text className="mb-2" style={styles.textLabel}>
                      E-mail:{" "}
                    </Text>
                    <TextInput
                      className="border1"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                      style={touched.email && errors.email ? styles.inputError : styles.input}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>
                  <View>
                    <Text className="mb-2" style={styles.textLabel}>
                      NIC number:{" "}
                    </Text>
                    <TextInput
                      className="border1"
                      onChangeText={handleChange("nic")}
                      onBlur={handleBlur("nic")}
                      value={values.nic}
                      style={touched.nic && errors.nic ? styles.inputError : styles.input}
                    />
                    {touched.nic && errors.nic && (
                      <Text style={styles.errorText}>{errors.nic}</Text>
                    )}
                  </View>
                  <View>
                    <Text className="mb-2" style={styles.textLabel}>
                      Password:{" "}
                    </Text>
                    <TextInput
                      className="border1"
                      onChangeText={handleChange("pswrd")}
                      onBlur={handleBlur("pswrd")}
                      value={values.pswrd}
                      secureTextEntry
                      style={touched.pswrd && errors.pswrd ? styles.inputError : styles.input}
                    />
                    {touched.pswrd && errors.pswrd && (
                      <Text style={styles.errorText}>{errors.pswrd}</Text>
                    )}
                  </View>
                  <View>
                    <Text className="mb-2" style={styles.textLabel}>
                      Confirm Password:
                    </Text>
                    <TextInput
                      className="border1"
                      onChangeText={handleChange("confPswrd")}
                      onBlur={handleBlur("confPswrd")}
                      value={values.confPswrd}
                      secureTextEntry
                      style={touched.confPswrd && errors.confPswrd ? styles.inputError : styles.input}
                    />
                    {touched.confPswrd && errors.confPswrd && (
                      <Text style={styles.errorText}>{errors.confPswrd}</Text>
                    )}
                  </View>

                  <View style={styles.buttonContainer}>
                    <Pressable
                      style={styles.submitButton}
                      onPress={handleSubmit}
                    >
                      <Text style={styles.buttonText}>SUBMIT</Text>
                    </Pressable>
                  </View>

                  <Link href="/login" asChild>
                    <Pressable>
                      <Text>Already have an account?</Text>
                    </Pressable>
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
  textLabel: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 4,
    padding: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginVertical: 10
  },
  submitButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default register;