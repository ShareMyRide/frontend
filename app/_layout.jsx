import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import '../global.css';

export default function Layout() {

  return (
    <SafeAreaProvider>
           <Stack
        
        screenOptions={{
          // Hide the header for this route
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  );
}
