import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../src/lib/api';

export default function ToursScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tours');
      setTours(res.data);
    } catch (e) {
      console.log('Error fetching tours', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full border border-gray-200">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Tours & Packages</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0A0060" style={{ marginTop: 50 }} />
        ) : tours.length === 0 ? (
          <Text className="text-center text-gray-500 mt-12">No tours available right now.</Text>
        ) : (
          tours.map((tour) => (
            <Pressable 
              key={tour.id} 
              onPress={() => router.push('/tours/' + tour.slug)}
              className="bg-white rounded-2xl mb-6 shadow-sm overflow-hidden border border-gray-100"
            >
              <Image source={{ uri: tour.image_url || 'https://images.unsplash.com/photo-1516483638261-f40af5ba3227' }} className="w-full h-48" />
              {tour.badge && (
                <View className="absolute top-4 left-4 bg-[#F97316] px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold uppercase">{tour.badge}</Text>
                </View>
              )}
              <View className="p-5">
                <Text className="text-lg font-bold text-gray-900 mb-2">{tour.title}</Text>
                <View className="flex-row items-center mb-1">
                  <MapPin size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-500 ml-1">{tour.destination}</Text>
                </View>
                <View className="flex-row items-center mb-4">
                  <Clock size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-500 ml-1">{tour.duration}</Text>
                </View>
                <View className="flex-row justify-between items-end border-t border-gray-100 pt-4">
                  <View>
                    <Text className="text-xs text-gray-500 font-medium">Starting from</Text>
                    <Text className="text-xl font-black text-[#0A0060]">${tour.price}</Text>
                  </View>
                  <View className="bg-gray-100 px-4 py-2 rounded-lg">
                    <Text className="text-sm font-bold text-[#0A0060]">View Details</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
