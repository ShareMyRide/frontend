import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const API_URL = 'http://192.168.216.78:2052/api/auth'; // Replace with API URL

const ForgotPassword = () => {
  const router = useRouter();
  
  
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle requesting OTP
  const handleRequestOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      Alert.alert('Success', response.data.message);
      setStep(2); 
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
      setResetToken(response.data.resetToken);
      Alert.alert('Success', 'OTP verified successfully');
      setStep(3); 
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        resetToken,
        newPassword,
        confirmPassword
      });
      
      Alert.alert('Success', response.data.message, [
        { text: 'OK', onPress: () => router.replace("/login")}
      ]);
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleResendOTP = () => {
    setIsLoading(true);
    axios.post(`${API_URL}/forgot-password`, { email })
      .then(response => {
        Alert.alert('Success', 'OTP resent successfully');
      })
      .catch(error => {
        const message = error.response?.data?.message || 'Failed to resend OTP';
        Alert.alert('Error', message);
      })
      .finally(() => setIsLoading(false));
  };

  
  const renderEmailStep = () => (
    <View className="mt-4 w-full border p-5 flex gap-4">
      <Text className="text-4xl font-bold text-center mb-4">Forgot Password</Text>
      <View>
        <Text className="mb-2">E-mail: </Text>
        <TextInput
          className="border p-2"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleRequestOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text className="text-blue-500 text-center">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );

 
  const renderOTPStep = () => (
    <View className="mt-4 w-full border p-5 flex gap-4">
      <Text className="text-4xl font-bold text-center mb-4">Enter OTP</Text>
      <View>
        <Text className="mb-2">OTP: </Text>
        <TextInput
          className="border p-2"
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleVerifyOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View className="flex-row justify-between">
        <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
          <Text className="text-blue-500">Resend OTP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text className="text-blue-500">Change Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

 
  const renderPasswordInput = (
    value, 
    onChangeText, 
    placeholder, 
    showPassword, 
    togglePasswordVisibility,
    label
  ) => (
    <View>
      <Text className="mb-2">{label}: </Text>
      <View className="flex-row items-center border">
        <TextInput
          className="flex-1 p-2"
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity 
          onPress={togglePasswordVisibility} 
          className="p-2"
        >
          <Feather 
            name={showPassword ? "eye" : "eye-off"} 
            size={24} 
            color="gray" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  
  const renderPasswordResetStep = () => (
    <View className="mt-4 w-full border p-5 flex gap-4">
      <Text className="text-4xl font-bold text-center mb-4">Reset Password</Text>
      
      {renderPasswordInput(
        newPassword, 
        setNewPassword, 
        "Enter new password", 
        showNewPassword, 
        () => setShowNewPassword(!showNewPassword),
        "New Password"
      )}
      
      {renderPasswordInput(
        confirmPassword, 
        setConfirmPassword, 
        "Confirm new password", 
        showConfirmPassword, 
        () => setShowConfirmPassword(!showConfirmPassword),
        "Confirm Password"
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text className="text-blue-500 text-center">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );

  
  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#f97316', 'white']}
        style={styles.container}
        start={{ x: 1.5, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView className="flex-1 justify-center">
          <View className="p-4 flex items-center justify-center">
            {step === 1 && renderEmailStep()}
            {step === 2 && renderOTPStep()}
            {step === 3 && renderPasswordResetStep()}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10
  },
  loginButton: {
    backgroundColor: "#f97316", 
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 5
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", 
  },
});

export default ForgotPassword;