import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

const CustomListView = ({ 
  data = [], 
  onItemPress, 
  onRefresh,
  onEndReached,
  isLoading = false,
  ListEmptyComponent,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      className="bg-white mx-4 my-2 rounded-lg shadow-md"
      onPress={() => onItemPress && onItemPress(item, index)}
    >
      <View className="p-4">
        <Text className="text-base font-semibold text-gray-800">
          {item.title}
        </Text>
        {item.description && (
          <Text className="text-sm text-gray-600 mt-1">
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View className="p-4 items-center">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const defaultEmptyComponent = () => (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-base text-gray-600">
        No items to display
      </Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      className="flex-1"
      contentContainerClassName="py-2"
      ListFooterComponent={renderFooter}
      ListEmptyComponent={ListEmptyComponent || defaultEmptyComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

export default CustomListView;