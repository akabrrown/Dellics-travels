import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Clock, CheckCircle2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../src/lib/api';

export default function TourDetailScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTour();
  }, [slug]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tours/' + slug);
      setTour(res.data);
    } catch (e) {
      console.log('Error fetching tour', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0A0060" />
      </View>
    );
  }

  if (!tour) return <View className="flex-1 bg-white items-center justify-center"><Text>Tour not found</Text></View>;

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative w-full h-80">
          <Image source={{ uri: tour.image_url || 'https://images.unsplash.com/photo-1516483638261-f40af5ba3227' }} className="w-full h-full" />
          <View className="absolute top-0 left-0 right-0 p-6 flex-row justify-between items-center" style={{ marginTop: insets.top }}>
            <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/90 items-center justify-center">
              <ChevronLeft size={24} color="#0A0060" />
            </Pressable>
          </View>
        </View>

        <View className="p-6 -mt-6 bg-white rounded-t-3xl">
          <Text className="text-2xl font-black text-[#0A0060] mb-3">{tour.title}</Text>
          
          <View className="flex-row items-center mb-6">
            <View className="flex-row items-center mr-6">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-sm text-gray-500 font-medium ml-1">{tour.destination}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={16} color="#6B7280" />
              <Text className="text-sm text-gray-500 font-medium ml-1">{tour.duration}</Text>
            </View>
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-3">Overview</Text>
          <Text className="text-base text-gray-600 leading-6 mb-6">{tour.overview}</Text>

          <Text className="text-lg font-bold text-gray-900 mb-3">Highlights</Text>
          {tour.highlights && tour.highlights.map((highlight, idx) => (
            <View key={idx} className="flex-row items-start mb-3 pr-4">
              <View className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 mr-3" />
              <Text className="text-base text-gray-600 leading-6">{highlight}</Text>
            </View>
          ))}

          <Text className="text-lg font-bold text-gray-900 mb-3 mt-6">What's Included</Text>
          {tour.includes && tour.includes.map((inc, idx) => (
            <View key={idx} className="flex-row items-center mb-3">
              <CheckCircle2 size={18} color="#10B981" />
              <Text className="text-base text-gray-600 ml-3">{inc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 flex-row justify-between items-center" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <View>
          <Text className="text-xs text-gray-500 font-bold uppercase">Price per person</Text>
          <Text className="text-2xl font-black text-[#0A0060]">${tour.price}</Text>
        </View>
        <Pressable 
          onPress={() => router.push({ pathname: '/tours/book', params: { id: tour.id, title: tour.title, price: tour.price } })}
          className="bg-[#0A0060] px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-bold text-base">Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}
