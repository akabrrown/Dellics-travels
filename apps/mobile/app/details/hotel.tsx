import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MapPin, Star, Wifi, Coffee, Wind, Dumbbell, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HotelDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Mock data for UI structure
  const hotel = {
    name: 'The Ritz-Carlton, Dubai',
    rating: 4.8,
    reviews: 1240,
    address: 'Jumeirah Beach Residence, Dubai',
    price: 320,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience luxury at its finest with our beachfront property featuring 6 pools, a world-class spa, and exquisite dining options.',
  };

  const handleBook = () => {
    router.push({
      pathname: '/checkout/review',
      params: { type: 'HOTEL', price: hotel.price, title: hotel.name }
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image Carousel */}
        <View style={{ height: 320, width }}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {hotel.images.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={{ width, height: 320 }} />
            ))}
          </ScrollView>
          
          <Pressable 
            onPress={() => router.back()} 
            className="absolute left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-md"
            style={{ top: Math.max(insets.top, 20) }}
          >
            <ChevronLeft color="white" size={24} />
          </Pressable>
        </View>

        {/* Content */}
        <View className="p-6 -mt-6 bg-white rounded-t-3xl shadow-sm">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-black text-gray-900 flex-1 mr-4">{hotel.name}</Text>
            <View className="bg-green-100 px-2 py-1 rounded-md flex-row items-center">
              <Star size={14} color="#16a34a" fill="#16a34a" />
              <Text className="text-green-700 font-bold text-xs ml-1">{hotel.rating}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-6">
            <MapPin size={14} color="#6B7280" />
            <Text className="text-gray-500 text-sm ml-1 mr-4">{hotel.address}</Text>
            <Text className="text-gray-400 text-sm">({hotel.reviews} reviews)</Text>
          </View>

          <Text className="text-sm font-bold text-gray-900 mb-3">About</Text>
          <Text className="text-gray-600 text-sm leading-6 mb-8">{hotel.description}</Text>

          <Text className="text-sm font-bold text-gray-900 mb-4">Amenities</Text>
          <View className="flex-row flex-wrap mb-8">
            <View className="w-1/2 flex-row items-center mb-4">
              <Wifi size={18} color="#0A0060" />
              <Text className="text-gray-700 ml-3 font-medium">Free Wi-Fi</Text>
            </View>
            <View className="w-1/2 flex-row items-center mb-4">
              <Coffee size={18} color="#0A0060" />
              <Text className="text-gray-700 ml-3 font-medium">Breakfast</Text>
            </View>
            <View className="w-1/2 flex-row items-center mb-4">
              <Wind size={18} color="#0A0060" />
              <Text className="text-gray-700 ml-3 font-medium">AC</Text>
            </View>
            <View className="w-1/2 flex-row items-center mb-4">
              <Dumbbell size={18} color="#0A0060" />
              <Text className="text-gray-700 ml-3 font-medium">Gym</Text>
            </View>
          </View>
          
          <Text className="text-sm font-bold text-gray-900 mb-4">Select Room</Text>
          <View className="border border-[#0A0060] rounded-xl p-4 bg-[#0A0060]/5 mb-12">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="font-bold text-gray-900">Deluxe King Room</Text>
              <Text className="font-black text-[#0A0060]">${hotel.price}<Text className="text-xs font-normal text-gray-500"> /night</Text></Text>
            </View>
            <Text className="text-gray-500 text-xs mb-3">1 King Bed • City View</Text>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-green-700 font-bold text-xs">Free Cancellation</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="p-6 bg-white border-t border-gray-100 flex-row justify-between items-center pb-8">
        <View>
          <Text className="text-gray-500 text-xs mb-1">Total (1 night)</Text>
          <Text className="text-2xl font-black text-gray-900">${hotel.price}</Text>
        </View>
        <Pressable 
          onPress={handleBook}
          className="bg-[#0A0060] px-8 py-4 rounded-xl flex-row items-center"
        >
          <Text className="text-white font-bold mr-2">Book Room</Text>
          <ChevronRight color="white" size={16} />
        </Pressable>
      </View>
    </View>
  );
}
