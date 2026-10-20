import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Star, Heart, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  photoReference?: string | null;
}

interface HotelCardProps {
  hotel: Hotel;
  onPress: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export function HotelCard({ hotel, onPress, onSave, isSaved }: HotelCardProps) {
  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onSave) onSave();
  };

  return (
    <Pressable 
      onPress={onPress}
      className="bg-white rounded-xl mb-4 overflow-hidden border border-gray-100 shadow-sm"
    >
      <View className="h-48 bg-gray-200 relative">
        <Image 
          source={{ uri: hotel.photoReference || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        <Pressable 
          onPress={handleSave}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 items-center justify-center backdrop-blur-sm"
        >
          <Heart size={16} color={isSaved ? '#F4740D' : '#374151'} fill={isSaved ? '#F4740D' : 'transparent'} />
        </Pressable>
        {/* Badges */}
        <View className="absolute top-3 left-3 bg-[#0A0060] px-2 py-1 rounded">
          <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Genius</Text>
        </View>
      </View>
      
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="flex-1 text-lg font-black text-gray-900 pr-4" numberOfLines={1}>
            {hotel.name}
          </Text>
          <View className="flex-row items-center bg-[#0A0060] px-1.5 py-0.5 rounded">
            <Text className="text-white font-bold text-xs mr-1">{hotel.rating.toFixed(1)}</Text>
            <Star size={10} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>
        
        <View className="flex-row items-center mb-3">
          <MapPin size={12} color="#6B7280" />
          <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>{hotel.location}</Text>
          <Text className="text-gray-400 text-xs mx-1">•</Text>
          <Text className="text-gray-500 text-xs">{hotel.reviewCount.toLocaleString()} reviews</Text>
        </View>

        {/* Cancellation Chip */}
        <View className="flex-row items-center mb-3">
          <View className="border border-[#1E7A34] px-2 py-0.5 rounded-sm bg-[#1E7A34]/5">
            <Text className="text-[#1E7A34] text-[10px] font-bold uppercase tracking-widest">Free cancellation</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-gray-500 text-xs font-medium line-through">${(hotel.pricePerNight * 1.2).toFixed(0)}</Text>
            <Text className="text-[#F4740D] text-[10px] font-bold uppercase tracking-widest mt-0.5">Mobile-only price</Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-black text-gray-900 leading-none">
              ${hotel.pricePerNight}
            </Text>
            <Text className="text-gray-500 text-xs font-medium mt-1">per night</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
