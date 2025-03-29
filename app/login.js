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

<<<<<<< Updated upstream

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
=======
      const response = await axios.post("http://192.168.216.78:2052/api/auth/login", {

        email: values.email,
        password: values.pswrd,
      });
      
      console.log("Login successful:", response.data);
      
     
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userId", response.data.user.id);
      
     
      await AsyncStorage.setItem("userData", JSON.stringify(response.data.user));
      
      alert("Login successful!");
      
     
      const userData = JSON.stringify(response.data.user);
      
     
      router.replace({
        pathname: "/bottom-navi",
        params: { user: userData }
      });
    } catch (error) {
      if (error.response) {
        console.error("Login failed:", error.response.data.message);
        alert(error.response.data.message || "Login failed");
      } else {
        console.error("Error during login:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
>>>>>>> Stashed changes
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
                <Pressable
                                  onPress={() => {
                                    router.push("/dashboard");
                                  }}
                                  className="bg-orange-600 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                  <Text className="text-white text-center">SUBMIT</Text>
                                </Pressable>
                <Link href="/register" asChild>
                  <Text className="underline"  style={styles.textLabel}>Haven't an account? Create Account</Text>
                </Link>
                <Link href="/forgetpassword" asChild>
                  <Text>Forget password</Text>
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
  }
});
export default login;
