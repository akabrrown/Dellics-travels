import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Star, Share, Heart, CheckCircle2, ChevronRight, Wifi, Coffee, Wind, Waves } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSearchHotels } from '../../src/hooks/useSearch';

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // Use the same search hook to get mock data (in real app, use useHotel(id))
  const { data: hotelsData, isLoading } = useSearchHotels({ destination: 'London' });
  const hotel = hotelsData?.data?.find((h: any) => h.id === id) || {
    name: 'The Grand Meridian',
    location: 'Central District, London',
    rating: 4.8,
    reviewCount: 2314,
    pricePerNight: 185,
    currency: 'USD',
    photoReference: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    website: null,
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Hero Image / Gallery Preview */}
        <View className="h-64 relative bg-gray-200">
          <Image 
            source={{ uri: hotel.photoReference || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
          
          <View className="absolute top-12 left-4 right-4 flex-row justify-between items-center">
            <Pressable 
              onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
              className="w-10 h-10 bg-white/90 rounded-full items-center justify-center backdrop-blur-md"
            >
              <ChevronLeft size={24} color="#0A0060" />
            </Pressable>
            <View className="flex-row">
              <Pressable className="w-10 h-10 bg-white/90 rounded-full items-center justify-center backdrop-blur-md mr-3">
                <Share size={20} color="#0A0060" />
              </Pressable>
              <Pressable className="w-10 h-10 bg-white/90 rounded-full items-center justify-center backdrop-blur-md">
                <Heart size={20} color="#0A0060" />
              </Pressable>
            </View>
          </View>

          <Pressable 
            onPress={() => router.push('/hotels/gallery')}
            className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md flex-row items-center"
          >
            <Text className="text-white font-bold text-xs mr-1">1 / 12 Photos</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="px-5 py-6">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="flex-1 text-3xl font-black text-gray-900 leading-tight pr-4">{hotel.name}</Text>
            <View className="bg-[#0A0060] rounded flex-row items-center px-2 py-1 mt-1">
              <Text className="text-white font-bold text-sm mr-1">{hotel.rating.toFixed(1)}</Text>
              <Star size={12} color="#FFF" fill="#FFF" />
            </View>
          </View>
          
          <View className="flex-row items-center mb-6">
            <MapPin size={16} color="#6B7280" />
            <Text className="text-gray-500 font-medium text-sm ml-1.5 flex-1">{hotel.location}</Text>
          </View>

          {/* Rating Breakdown */}
          <Pressable className="bg-white rounded-xl p-4 mb-6 border border-gray-100 shadow-sm flex-row items-center justify-between">
            <View>
              <Text className="text-gray-900 font-black text-base">Exceptional</Text>
              <Text className="text-gray-500 font-medium text-xs mt-0.5">Based on {hotel.reviewCount} reviews</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </Pressable>

          {/* Amenities Summary */}
          <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Top Amenities</Text>
          <View className="flex-row flex-wrap mb-6">
            <View className="w-1/2 flex-row items-center mb-4">
              <Wifi size={20} color="#0A0060" className="mr-3" />
              <Text className="text-gray-700 font-semibold">Free High-Speed WiFi</Text>
            </View>
            <View className="w-1/2 flex-row items-center mb-4">
              <Waves size={20} color="#0A0060" className="mr-3" />
              <Text className="text-gray-700 font-semibold">Outdoor Pool</Text>
            </View>
            <View className="w-1/2 flex-row items-center mb-4">
              <Coffee size={20} color="#0A0060" className="mr-3" />
              <Text className="text-gray-700 font-semibold">Breakfast Available</Text>
            </View>
            <View className="w-1/2 flex-row items-center mb-4">
              <Wind size={20} color="#0A0060" className="mr-3" />
              <Text className="text-gray-700 font-semibold">Air Conditioning</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-700 leading-relaxed mb-6">
            Experience luxury in the heart of the city. Featuring modern amenities, an award-winning restaurant, and panoramic views from our rooftop terrace.
          </Text>

          {/* Room Selection Call to Action */}
          <View className="bg-blue-50 border border-[#0A0060]/20 rounded-xl p-5 mb-6">
            <View className="flex-row items-center mb-3">
              <CheckCircle2 size={20} color="#1E7A34" className="mr-2" />
              <Text className="text-[#1E7A34] font-bold text-sm uppercase tracking-widest">Free Cancellation available</Text>
            </View>
            <Text className="text-gray-900 font-black text-lg mb-1">Ready to book?</Text>
            <Text className="text-gray-600 mb-4">Check our available rooms and current rates.</Text>
            <Pressable 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/hotels/rooms?hotelId=${hotel.id}`);
              }}
              className="bg-[#0A0060] py-3 rounded-lg items-center"
            >
              <Text className="text-white font-black text-base">View 5 Available Rooms</Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex-row items-center justify-between shadow-xl">
        <View>
          <Text className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-0.5">Price from</Text>
          <Text className="text-2xl font-black text-[#0A0060]">${hotel.pricePerNight} <Text className="text-gray-500 text-xs font-medium">/ night</Text></Text>
        </View>
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(`/hotels/rooms?hotelId=${hotel.id}`);
          }}
          className="bg-[#F4740D] px-8 py-3.5 rounded-xl shadow-sm"
        >
          <Text className="text-white font-black text-lg">Reserve</Text>
        </Pressable>
      </View>
    </View>
  );
}
