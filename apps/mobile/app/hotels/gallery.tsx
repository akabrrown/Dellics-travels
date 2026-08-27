import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const HOTEL_PHOTOS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&q=80',
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&q=80',
];

export default function PhotoGalleryScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView edges={['top']} className="bg-black" />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center z-10">
        <Text className="text-white font-bold text-sm">
          {activeIndex + 1} of {HOTEL_PHOTOS.length} Photos
        </Text>
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
        >
          <X size={24} color="#FFF" />
        </Pressable>
      </View>

      {/* Swipeable Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {HOTEL_PHOTOS.map((url, idx) => (
          <View key={idx} style={{ width }} className="flex-1 justify-center items-center px-2">
            <Image 
              source={{ uri: url }} 
              style={{ width: width - 16, height: 400 }}
              resizeMode="contain"
              className="rounded-xl"
            />
          </View>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      <SafeAreaView edges={['bottom']} className="pb-6">
        <View className="flex-row justify-center items-center space-x-2">
          {HOTEL_PHOTOS.map((_, idx) => (
            <View 
              key={idx} 
              className={`h-2 rounded-full ${idx === activeIndex ? 'w-6 bg-[#F4740D]' : 'w-2 bg-white/40'}`} 
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
