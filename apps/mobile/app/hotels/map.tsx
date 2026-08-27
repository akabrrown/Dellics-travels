import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, List, MapPin } from 'lucide-react-native';

export default function HotelMapScreen() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-blue-100 relative">
      {/* Fake Map Background */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80' }} 
        className="absolute inset-0 w-full h-full opacity-60"
        resizeMode="cover"
      />
      
      <SafeAreaView edges={['top']} className="flex-1 justify-between pb-8">
        {/* Header Overlay */}
        <View className="flex-row items-center justify-between px-4 py-2 mt-2">
          <Pressable 
            onPress={() => router.back()}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
          >
            <ChevronLeft size={24} color="#0A0060" />
          </Pressable>
          
          <Pressable 
            onPress={() => router.back()}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
          >
            <List size={20} color="#0A0060" />
          </Pressable>
        </View>

        {/* Map Pins Overlay */}
        <View className="flex-1 relative">
          <Pressable className="absolute top-[20%] left-[30%] bg-white rounded-full px-3 py-1.5 shadow-md flex-row items-center border border-gray-200">
            <Text className="text-[#0A0060] font-black text-sm">$185</Text>
          </Pressable>
          <Pressable className="absolute top-[45%] right-[20%] bg-[#F4740D] rounded-full px-3 py-1.5 shadow-md flex-row items-center">
            <Text className="text-white font-black text-sm">$95</Text>
          </Pressable>
          <Pressable className="absolute top-[60%] left-[15%] bg-white rounded-full px-3 py-1.5 shadow-md flex-row items-center border border-gray-200">
            <Text className="text-[#0A0060] font-black text-sm">$120</Text>
          </Pressable>
        </View>

        {/* Mini Preview Card */}
        <View className="px-4">
          <Pressable 
            onPress={() => router.push('/hotels/h1')}
            className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 flex-row"
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80' }} 
              className="w-20 h-20 rounded-lg mr-4"
              resizeMode="cover"
            />
            <View className="flex-1 justify-center">
              <Text className="text-base font-black text-gray-900 mb-1" numberOfLines={1}>The Grand Meridian</Text>
              <View className="flex-row items-center mb-2">
                <MapPin size={12} color="#6B7280" />
                <Text className="text-gray-500 text-xs ml-1">Central District</Text>
              </View>
              <Text className="text-xl font-black text-[#0A0060]">$185 <Text className="text-gray-500 text-xs font-medium">/ night</Text></Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
