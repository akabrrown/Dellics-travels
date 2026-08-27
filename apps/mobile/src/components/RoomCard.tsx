import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Check, Users, BedDouble, Scaling } from 'lucide-react-native';

interface Room {
  id: string;
  name: string;
  bedType: string;
  maxGuests: number;
  sizeSqft: number;
  pricePerNight: number;
  totalPrice: number;
  cancellationPolicy: string;
  photoUrl: string;
  amenities: string[];
}

interface RoomCardProps {
  room: Room;
  onSelect: () => void;
  isSelected?: boolean;
}

export function RoomCard({ room, onSelect, isSelected }: RoomCardProps) {
  return (
    <Pressable 
      onPress={onSelect}
      className={`bg-white rounded-xl mb-4 overflow-hidden border-2 ${isSelected ? 'border-[#0A0060]' : 'border-gray-100 shadow-sm'}`}
    >
      <View className="h-40 bg-gray-200 relative">
        <Image 
          source={{ uri: room.photoUrl }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        {isSelected && (
          <View className="absolute top-2 right-2 bg-[#0A0060] rounded-full p-1 border-2 border-white shadow-sm">
            <Check size={16} color="#FFF" />
          </View>
        )}
      </View>
      
      <View className="p-4">
        <Text className="text-xl font-black text-gray-900 mb-3">{room.name}</Text>
        
        <View className="flex-row items-center mb-4">
          <View className="flex-row items-center mr-4">
            <BedDouble size={14} color="#6B7280" />
            <Text className="text-gray-600 text-xs font-semibold ml-1.5">{room.bedType}</Text>
          </View>
          <View className="flex-row items-center mr-4">
            <Users size={14} color="#6B7280" />
            <Text className="text-gray-600 text-xs font-semibold ml-1.5">Sleeps {room.maxGuests}</Text>
          </View>
          <View className="flex-row items-center">
            <Scaling size={14} color="#6B7280" />
            <Text className="text-gray-600 text-xs font-semibold ml-1.5">{room.sizeSqft} sqft</Text>
          </View>
        </View>

        {/* Mini Amenities */}
        <View className="flex-row flex-wrap mb-4">
          {room.amenities.map((amenity, index) => (
            <View key={index} className="flex-row items-center w-1/2 mb-1">
              <Check size={12} color="#1E7A34" className="mr-1" />
              <Text className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">{amenity}</Text>
            </View>
          ))}
        </View>
        
        <View className="flex-row justify-between items-end border-t border-gray-100 pt-3">
          <View>
            <Text className="text-[#1E7A34] text-[10px] font-bold uppercase tracking-widest mb-1">{room.cancellationPolicy}</Text>
            <Text className="text-gray-500 text-xs font-medium">Total for 3 nights</Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-black text-[#0A0060] leading-none mb-1">
              ${room.totalPrice}
            </Text>
            <Text className="text-gray-500 text-xs font-medium">${room.pricePerNight} / night</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
