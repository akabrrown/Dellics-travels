import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';

export default function HotelFiltersScreen() {
  const router = useRouter();
  const [selectedStars, setSelectedStars] = useState<number[]>([4, 5]);
  const [freeCancellation, setFreeCancellation] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [pool, setPool] = useState(true);

  const toggleStar = (star: number) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter(s => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <X size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-lg font-black text-gray-900">Filters</Text>
        <Pressable onPress={() => {
          setSelectedStars([]);
          setFreeCancellation(false);
          setBreakfast(false);
          setPool(false);
        }}>
          <Text className="text-[#F4740D] font-bold text-sm">Clear all</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Popular Filters */}
        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Popular</Text>
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
          <Text className="text-base font-bold text-gray-900">Free cancellation</Text>
          <Switch 
            value={freeCancellation} 
            onValueChange={setFreeCancellation}
            trackColor={{ false: '#E5E7EB', true: '#1E7A34' }}
            thumbColor={'#FFFFFF'}
          />
        </View>
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100 mb-6">
          <Text className="text-base font-bold text-gray-900">Breakfast included</Text>
          <Switch 
            value={breakfast} 
            onValueChange={setBreakfast}
            trackColor={{ false: '#E5E7EB', true: '#1E7A34' }}
            thumbColor={'#FFFFFF'}
          />
        </View>

        {/* Star Rating */}
        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Star Rating</Text>
        <View className="flex-row flex-wrap mb-6">
          {[5, 4, 3, 2, 1].map((star) => {
            const isSelected = selectedStars.includes(star);
            return (
              <Pressable 
                key={star}
                onPress={() => toggleStar(star)}
                className={`flex-row items-center border rounded-full px-4 py-2 mr-3 mb-3 ${
                  isSelected ? 'border-[#0A0060] bg-[#0A0060]' : 'border-gray-300 bg-white'
                }`}
              >
                <Text className={`font-bold mr-1 ${isSelected ? 'text-white' : 'text-gray-700'}`}>{star}</Text>
                <Text className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>Stars</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Amenities */}
        <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Amenities</Text>
        <Pressable 
          onPress={() => setPool(!pool)}
          className="flex-row items-center py-3"
        >
          <View className={`w-6 h-6 rounded border items-center justify-center mr-3 ${pool ? 'bg-[#0A0060] border-[#0A0060]' : 'border-gray-300 bg-white'}`}>
            {pool && <Check size={14} color="#FFF" />}
          </View>
          <Text className="text-base font-medium text-gray-900">Swimming Pool</Text>
        </Pressable>

        <Pressable className="flex-row items-center py-3">
          <View className="w-6 h-6 rounded border border-gray-300 bg-white items-center justify-center mr-3" />
          <Text className="text-base font-medium text-gray-900">Fitness Center</Text>
        </Pressable>

        <Pressable className="flex-row items-center py-3">
          <View className="w-6 h-6 rounded border border-gray-300 bg-white items-center justify-center mr-3" />
          <Text className="text-base font-medium text-gray-900">Spa</Text>
        </Pressable>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <Pressable 
          onPress={() => router.back()}
          className="bg-[#F4740D] py-4 rounded-xl items-center shadow-sm"
        >
          <Text className="text-white font-black text-lg">Show 24 results</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
