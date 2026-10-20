import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Copy, PlaneTakeoff, Hotel } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  // Mock booking reference based on ID
  const pnr = (bookingId || 'DLX92K').substring(0, 6).toUpperCase();

  const handleCopyPNR = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In a real app, copy to clipboard here
  };

  const handleViewTrip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Route to the trips tab or specific trip detail
    router.replace('/(tabs)/trips');
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100, alignItems: 'center', paddingTop: 60 }}>
        
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
          <CheckCircle2 size={48} color="#1E7A34" />
        </View>

        <Text className="text-3xl font-black text-gray-900 text-center mb-2">Booking Confirmed!</Text>
        <Text className="text-base text-gray-500 text-center mb-8 px-4 leading-relaxed">
          Your reservation is complete. A confirmation email is on its way to your inbox.
        </Text>

        {/* PNR Card */}
        <View className="w-full bg-white border border-gray-200 rounded-[16px] p-6 mb-6 shadow-sm items-center">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Booking Reference</Text>
          <View className="flex-row items-center justify-center">
            <Text className="text-4xl font-black text-[#0A0060] tracking-widest">{pnr}</Text>
            <Pressable onPress={handleCopyPNR} className="ml-4 p-2 bg-gray-50 rounded-full">
              <Copy size={20} color="#6B7280" />
            </Pressable>
          </View>
        </View>

        {/* Next Steps */}
        <View className="w-full bg-blue-50 border border-blue-100 rounded-[16px] p-5 mb-6">
          <Text className="text-sm font-bold text-[#0A0060] mb-3">Next Steps</Text>
          <View className="flex-row items-start mb-3">
            <View className="w-6 h-6 rounded-full bg-white items-center justify-center mr-3 mt-0.5">
              <Text className="text-[#0A0060] font-black text-xs">1</Text>
            </View>
            <Text className="text-sm text-gray-700 flex-1 leading-relaxed">Save your booking reference for check-in.</Text>
          </View>
          <View className="flex-row items-start">
            <View className="w-6 h-6 rounded-full bg-white items-center justify-center mr-3 mt-0.5">
              <Text className="text-[#0A0060] font-black text-xs">2</Text>
            </View>
            <Text className="text-sm text-gray-700 flex-1 leading-relaxed">Add a hotel or car rental to this trip.</Text>
          </View>
        </View>

        {/* S27 eSIM Upsell Chip */}
        <Pressable 
          onPress={() => router.push('/esim')}
          className="w-full bg-orange-50 border border-orange-200 rounded-[16px] p-4 flex-row items-center justify-between mb-8"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-10 h-10 bg-[#F4740D]/10 rounded-full items-center justify-center mr-3">
              <Text className="text-[#F4740D] font-black text-lg">📡</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-900">Add eSIM Data Plan for this Trip</Text>
              <Text className="text-xs text-gray-500">Instant connectivity on arrival from $4.50</Text>
            </View>
          </View>
          <Text className="text-[#F4740D] font-black text-xs uppercase tracking-wider">Get eSIM →</Text>
        </Pressable>

      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pt-4 pb-8 flex-row shadow-lg">
        <Pressable 
          onPress={handleHome}
          className="flex-1 border-2 border-gray-200 h-14 items-center justify-center rounded-[8px] mr-3"
        >
          <Text className="text-gray-700 font-black text-sm uppercase tracking-widest">Home</Text>
        </Pressable>
        <Pressable 
          onPress={handleViewTrip}
          className="flex-[2] bg-[#0A0060] h-14 items-center justify-center rounded-[8px]"
        >
          <Text className="text-white font-black text-sm uppercase tracking-widest">View Itinerary</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
