import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Heart, MapPin, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const SAVED_ITEMS = [
  {
    id: '1',
    type: 'hotel',
    name: 'Atlantis The Royal',
    location: 'Palm Jumeirah, Dubai',
    rating: 4.9,
    reviews: 1240,
    price: '$850',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    type: 'package',
    name: 'Maldives Honeymoon Special',
    location: 'Male, Maldives',
    rating: 4.8,
    reviews: 856,
    price: '$2,400',
    image: 'https://images.unsplash.com/photo-1514282401047-d1575c5eb62d?auto=format&fit=crop&q=80&w=800',
  },
];

export default function SavedScreen() {
  const router = useRouter();
  const [items, setItems] = useState(SAVED_ITEMS);

  const toggleSave = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Saved</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View className="bg-white border border-gray-200 p-8 items-center" style={{ borderRadius: 8 }}>
            <Heart size={32} color="#D1D5DB" />
            <Text className="text-gray-500 font-bold text-sm mt-4 text-center">No saved items.</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">Tap the heart icon on hotels, flights, and packages to save them here.</Text>
          </View>
        ) : (
          items.map((item) => (
            <Pressable 
              key={item.id}
              className="bg-white border border-gray-200 mb-6 overflow-hidden" 
              style={{ borderRadius: 8 }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (item.type === 'hotel') router.push('/search/hotels');
              }}
            >
              <View className="h-48 w-full relative">
                <Image source={{ uri: item.image }} className="w-full h-full" />
                <View className="absolute inset-0 bg-black/20" />
                <Pressable 
                  onPress={() => toggleSave(item.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 items-center justify-center rounded-full"
                >
                  <Heart size={20} color="white" fill="white" />
                </Pressable>
                <View className="absolute top-4 left-4 bg-[#0A0060] px-2 py-1 rounded">
                  <Text className="text-white text-[10px] font-black uppercase tracking-widest">{item.type}</Text>
                </View>
              </View>
              <View className="p-4">
                <Text className="font-black text-lg text-gray-900 mb-1">{item.name}</Text>
                <View className="flex-row items-center mb-3">
                  <MapPin size={14} color="#D1D5DB" />
                  <Text className="text-gray-500 text-xs font-semibold ml-1">{item.location}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Star size={16} color="#F4740D" fill="#F4740D" />
                    <Text className="font-black text-sm text-gray-900 ml-1">{item.rating}</Text>
                    <Text className="text-gray-400 text-xs ml-1">({item.reviews})</Text>
                  </View>
                  <Text className="font-black text-xl text-[#0A0060]">{item.price}</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
