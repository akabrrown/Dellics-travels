import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { RoomCard } from '../../../src/components/RoomCard';

const MOCK_ROOMS = [
  {
    id: 'r1',
    name: 'Standard Queen Room',
    bedType: '1 Queen Bed',
    maxGuests: 2,
    sizeSqft: 280,
    pricePerNight: 185,
    totalPrice: 555,
    cancellationPolicy: 'Free cancellation until Oct 10',
    photoUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    amenities: ['City View', 'Free WiFi', 'Flat-screen TV'],
  },
  {
    id: 'r2',
    name: 'Deluxe King Room',
    bedType: '1 King Bed',
    maxGuests: 2,
    sizeSqft: 350,
    pricePerNight: 240,
    totalPrice: 720,
    cancellationPolicy: 'Non-refundable',
    photoUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    amenities: ['Ocean View', 'Free WiFi', 'Balcony', 'Minibar'],
  },
  {
    id: 'r3',
    name: 'Executive Suite',
    bedType: '1 King Bed + 1 Sofa Bed',
    maxGuests: 4,
    sizeSqft: 520,
    pricePerNight: 390,
    totalPrice: 1170,
    cancellationPolicy: 'Free cancellation until Oct 10',
    photoUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    amenities: ['Panoramic View', 'Lounge Access', 'Kitchenette', 'Free Breakfast'],
  }
];

export default function RoomSelectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleSelectRoom = (roomId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRoomId(roomId);
  };

  const handleContinue = () => {
    if (!selectedRoomId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real flow, you would pass the hotel and room ID to the checkout screen
    // or add it to a package builder state.
    router.push('/checkout/hotel');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F9FAFB]">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100 shadow-sm z-10">
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full mr-3"
        >
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <View>
          <Text className="text-lg font-black text-gray-900">Select a Room</Text>
          <Text className="text-xs text-gray-500 font-semibold">Oct 12 - Oct 15 • 3 Nights</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {MOCK_ROOMS.map((room) => (
          <RoomCard 
            key={room.id}
            room={room}
            isSelected={selectedRoomId === room.id}
            onSelect={() => handleSelectRoom(room.id)}
          />
        ))}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      {selectedRoomId && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 shadow-xl">
          <Pressable 
            onPress={handleContinue}
            className="bg-[#0A0060] py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-black text-lg">Continue to Checkout</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
