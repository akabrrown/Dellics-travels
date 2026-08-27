import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Search, MapPin, Plane } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSearchStore } from '../../src/store/useSearchStore';
import { useLocationSearch, Place } from '../../src/hooks/useLocationSearch';

export default function LocationSearchScreen() {
  const router = useRouter();
  const { field } = useLocalSearchParams<{ field: string }>();
  
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  
  const setLocation = useSearchStore(state => state.setLocation);
  const addRecentSearch = useSearchStore(state => state.addRecentSearch);
  const recentSearches = useSearchStore(state => state.recentSearches);
  const clearRecentSearches = useSearchStore(state => state.clearRecentSearches);
  const locations = useSearchStore(state => state.locations);

  // Determine search type based on field
  const searchType = field?.includes('hotel') ? 'hotel' : 'flight';

  const { data: places, isLoading, error } = useLocationSearch(debouncedQuery, searchType);

  // Dynamic placeholder text based on search intent
  let placeholderText = "Search cities or airports";
  if (field?.includes('hotel')) {
    placeholderText = "Search for a city or region";
  } else if (field?.includes('car')) {
    placeholderText = "Search airport or city for car rental";
  } else if (field?.includes('generic')) {
    placeholderText = "Where are you going?";
  }

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const handleSelect = (place: Place) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Format the value based on the field type
    // If it's a flight, we usually want "City (IATA)"
    // If it's a hotel or generic, we might just want "City"
    let formattedValue = place.cityName;
    
    if (field?.includes('flight') && place.iataCode) {
      formattedValue = `${place.cityName} (${place.iataCode})`;
    } else if (place.countryName) {
      formattedValue = `${place.cityName}, ${place.countryName}`;
    }
    
    addRecentSearch(place);
    setLocation(field || 'genericDestination', formattedValue);
    router.back();
  };

  const renderItem = ({ item }: { item: Place }) => (
    <Pressable 
      onPress={() => handleSelect(item)}
      className="flex-row items-center py-4 border-b border-gray-100"
    >
      <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4">
        {item.type === 'airport' ? (
          <Plane size={20} color="#6B7280" />
        ) : (
          <MapPin size={20} color="#6B7280" />
        )}
      </View>
      <View className="flex-1 pr-4">
        <Text className="text-base font-bold text-gray-900 mb-0.5">{item.name}</Text>
        <Text className="text-xs text-gray-500 font-medium">{item.cityName}{item.countryName ? `, ${item.countryName}` : ''}</Text>
      </View>
      {item.iataCode && (
        <View className="bg-gray-100 px-2 py-1 rounded">
          <Text className="text-xs font-bold text-gray-600">{item.iataCode}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header Search Bar */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100 shadow-sm z-10 bg-white">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 h-12 mr-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              ref={inputRef}
              className="flex-1 ml-3 text-base text-gray-900 font-medium"
              placeholder={placeholderText}
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="words"
              autoCorrect={false}
              clearButtonMode="always"
            />
          </View>
          <Pressable 
            onPress={() => router.back()}
            className="p-2 -mr-2"
          >
            <Text className="text-[#0A0060] font-bold text-base">Cancel</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1 px-4">
          {isLoading && query.length > 1 ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="small" color="#0A0060" />
              <Text className="text-gray-500 mt-4 font-medium">Searching destinations...</Text>
            </View>
          ) : query.length < 2 ? (
            <View className="py-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest">Recent Searches</Text>
                {recentSearches.length > 0 && (
                  <Pressable onPress={clearRecentSearches}>
                    <Text className="text-sm font-medium text-[#0A0060]">Clear</Text>
                  </Pressable>
                )}
              </View>
              {recentSearches.length === 0 ? (
                <Text className="text-gray-400 mt-2">No recent searches</Text>
              ) : (
                recentSearches.map((item, index) => (
                  <Pressable key={`recent-${item.id}-${index}`} onPress={() => handleSelect(item)} className="py-3 flex-row items-center border-b border-gray-100">
                    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center mr-3">
                      {item.type === 'airport' ? (
                        <Plane size={16} color="#9CA3AF" />
                      ) : (
                        <MapPin size={16} color="#9CA3AF" />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-700 font-medium text-base">{item.name}</Text>
                      <Text className="text-gray-400 text-xs">{item.cityName}{item.countryName ? `, ${item.countryName}` : ''}</Text>
                    </View>
                  </Pressable>
                ))
              )}
            </View>
          ) : places?.length === 0 ? (
            <View className="py-8 items-center justify-center">
              <Text className="text-gray-500 font-medium text-center">No locations found for "{query}".</Text>
            </View>
          ) : (
            <FlatList
              data={places}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
