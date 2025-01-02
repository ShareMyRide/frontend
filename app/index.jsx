import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View className="w-full h-full flex items-center justify-center">
      <Text>Welcome</Text>
      <Text className="text-red-400">Share My Ride</Text>
      
      <Link href="/introone" asChild>
          <Pressable className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Text>Next</Text>
          </Pressable>
        </Link>
    </View>
  );
}
