import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('introone'); 
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer); 
  }, []); 

  return (
    <View style={styles.container}> 
      <Text style={styles.h1}>Welcome</Text>
      <Text style={styles.h3}>Share My Ride</Text>
      <View style={{ flex: 1 }} /> {/* Add a flex: 1 view to push content to the top */}
      <ActivityIndicator size="large" color="#343438" /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  h1: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
  },
  h3: {
    fontSize: 18, 
    marginBottom: 20, 
  },
});