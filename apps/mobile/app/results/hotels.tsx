import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Map as MapIcon, SlidersHorizontal } from 'lucide-react-native';
import { useSearchHotels } from '../../src/hooks/useSearch';
import { HotelCard } from '../../src/components/HotelCard';
import * as Haptics from 'expo-haptics';

function SkeletonHotel() {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ])
    ).start();
    return () => opacity.stopAnimation();
  }, []);

  return (
    <Animated.View style={{ opacity }} className="bg-white rounded-xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
      <View className="h-48 bg-gray-200" />
      <View className="p-4">
        <View className="w-3/4 h-6 bg-gray-200 rounded-md mb-3" />
        <View className="w-1/2 h-4 bg-gray-200 rounded-md mb-6" />
        <View className="flex-row justify-between items-end">
          <View className="w-1/4 h-4 bg-gray-200 rounded-md" />
          <View className="w-1/3 h-8 bg-gray-200 rounded-md" />
        </View>
      </View>
    </Animated.View>
  );
}

export default function HotelResultsScreen() {
  const router = useRouter();
  const { destination } = useLocalSearchParams<{ destination: string }>();
  
  // E.g., parse destination if it was passed like "ACC_LHR" or just use it.
  const destStr = destination?.split('_')[1] || destination || 'London';

  const { data: hotelsData, isLoading } = useSearchHotels({ destination: destStr });

  const hotels = hotelsData?.data || [];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-10">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full"
        >
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <View className="flex-1 px-4">
          <Text className="text-lg font-black text-gray-900 text-center" numberOfLines={1}>
            {destStr}
          </Text>
          <Text className="text-xs text-gray-500 font-semibold text-center">Oct 12 - Oct 15 • 2 Guests</Text>
        </View>
        <Pressable 
          onPress={() => router.push('/hotels/map')}
          className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full"
        >
          <MapIcon size={20} color="#0A0060" />
        </Pressable>
      </View>

      {/* Filter Chips Bar */}
      <View className="bg-white border-b border-gray-100 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/hotels/filters');
            }}
            className="flex-row items-center bg-[#0A0060] px-3 py-1.5 rounded-full mr-2"
          >
            <SlidersHorizontal size={14} color="#FFFFFF" className="mr-1.5" />
            <Text className="text-white font-bold text-xs uppercase tracking-widest">Filters</Text>
          </Pressable>
          
          <Pressable className="border border-gray-300 px-3 py-1.5 rounded-full mr-2 bg-white">
            <Text className="text-gray-700 font-bold text-xs">Free cancellation</Text>
          </Pressable>
          <Pressable className="border border-gray-300 px-3 py-1.5 rounded-full mr-2 bg-white">
            <Text className="text-gray-700 font-bold text-xs">Price</Text>
          </Pressable>
          <Pressable className="border border-gray-300 px-3 py-1.5 rounded-full mr-2 bg-white">
            <Text className="text-gray-700 font-bold text-xs">4+ Stars</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Results List */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-lg font-black text-[#0A0060] mb-4">
          {isLoading ? 'Searching...' : `${hotels.length} properties found`}
        </Text>

        {isLoading ? (
          <>
            <SkeletonHotel />
            <SkeletonHotel />
            <SkeletonHotel />
          </>
        ) : (
          hotels.map((hotel: any) => (
            <HotelCard 
              key={hotel.id}
              hotel={hotel}
              onPress={() => router.push(`/hotels/${hotel.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
