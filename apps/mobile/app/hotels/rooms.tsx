import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2, User, Wifi, Coffee, ShieldCheck, Bed } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function RoomSelectionScreen() {
  const router = useRouter();
  const { hotelId } = useLocalSearchParams<{ hotelId: string }>();

  const [selectedRoomId, setSelectedRoomId] = useState('deluxe_king');

  const rooms = [
    {
      id: 'deluxe_king',
      name: 'Deluxe King Room',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
      price: 185,
      bed: '1 Extra-Large King Bed',
      maxOccupancy: '2 Adults',
      size: '38 m²',
      breakfast: 'Free Breakfast included',
      cancellation: 'Free cancellation until 48 hours before check-in',
      tag: 'Best Seller',
    },
    {
      id: 'executive_suite',
      name: 'Executive Suite with City View',
      image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80',
      price: 290,
      bed: '1 King Bed + 1 Sofa Bed',
      maxOccupancy: '3 Guests (2 Adults + 1 Child)',
      size: '55 m²',
      breakfast: 'Full English Breakfast included',
      cancellation: 'Free cancellation until 24 hours before check-in',
      tag: 'Popular Choice',
    },
    {
      id: 'presidential_suite',
      name: 'Presidential Penthouse Suite',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
      price: 450,
      bed: '2 Super King Beds',
      maxOccupancy: '4 Guests',
      size: '95 m²',
      breakfast: 'All-Inclusive Gourmet Dining & Room Service',
      cancellation: 'Fully refundable anytime prior to check-in',
      tag: 'VIP Luxury',
    },
  ];

  const handleSelectRoom = (roomId: string, price: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedRoomId(roomId);
    router.push(`/checkout/${hotelId || '1'}?type=HOTEL&roomId=${roomId}&price=${price}`);
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView edges={['top']} className="bg-[#0A0060]" />

      {/* Header */}
      <View className="bg-[#0A0060] px-4 py-4 border-b border-[#0A0060] flex-row items-center">
        <Pressable 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
          className="p-2 mr-2 -ml-2"
        >
          <ChevronLeft size={24} color="#FFF" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-black text-white">Select Your Room</Text>
          <Text className="text-sm font-semibold text-blue-200">The Grand Meridian • London</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          return (
            <View 
              key={room.id}
              className={`bg-white rounded-[16px] mb-6 overflow-hidden border-2 shadow-sm ${
                isSelected ? 'border-[#0A0060]' : 'border-gray-100'
              }`}
            >
              <View className="h-44 relative bg-gray-200">
                <Image 
                  source={{ uri: room.image }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full">
                  <Text className="text-white font-bold text-[10px] uppercase tracking-widest">{room.tag}</Text>
                </View>
              </View>

              <View className="p-5">
                <View className="flex-row justify-between items-start mb-3">
                  <Text className="text-xl font-black text-gray-900 flex-1 mr-2">{room.name}</Text>
                  <View className="items-end">
                    <Text className="text-2xl font-black text-[#0A0060]">${room.price}</Text>
                    <Text className="text-xs font-semibold text-gray-400">per night</Text>
                  </View>
                </View>

                {/* Specs */}
                <View className="flex-row items-center mb-2">
                  <Bed size={16} color="#4B5563" className="mr-2" />
                  <Text className="text-sm text-gray-700 font-medium">{room.bed} · {room.size}</Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <User size={16} color="#4B5563" className="mr-2" />
                  <Text className="text-sm text-gray-700 font-medium">{room.maxOccupancy}</Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <Coffee size={16} color="#1E7A34" className="mr-2" />
                  <Text className="text-sm text-[#1E7A34] font-bold">{room.breakfast}</Text>
                </View>

                <View className="flex-row items-center mb-5">
                  <ShieldCheck size={16} color="#1E7A34" className="mr-2" />
                  <Text className="text-sm text-green-700 font-medium">{room.cancellation}</Text>
                </View>

                <Pressable
                  onPress={() => handleSelectRoom(room.id, room.price)}
                  className="w-full bg-[#0A0060] py-3.5 rounded-lg items-center justify-center"
                >
                  <Text className="text-white font-black uppercase tracking-widest text-xs">
                    Select Room & Reserve
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
