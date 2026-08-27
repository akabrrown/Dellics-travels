import React from 'react';
import { View, Text, ScrollView, Pressable, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Plane, Bed, Share2, DownloadCloud, ArrowLeft, Ticket } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Check out my upcoming trip on Dellics Travels: https://dellicstravels.com/trip/${id}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openVoucher = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/trips/voucher');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Itinerary</Text>
        <Pressable onPress={handleShare} className="p-2 -mr-2">
          <Share2 size={24} color="#0A0060" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Trip Header */}
        <View className="mb-8">
          <Text className="text-3xl font-black text-gray-900 mb-1 tracking-tight">London Getaway</Text>
          <Text className="text-gray-500 font-semibold text-sm">Oct 15 - Oct 22, 2026</Text>
        </View>

        {/* Boarding Pass Banner */}
        <Pressable 
          onPress={openVoucher}
          className="bg-[#EAF4EC] border border-[#1E7A34] p-4 mb-8 flex-row items-center justify-between" 
          style={{ borderRadius: 8 }}
        >
          <View className="flex-row items-center">
            <Ticket size={20} color="#1E7A34" />
            <Text className="text-[#1E7A34] font-black ml-3 text-sm tracking-widest uppercase">Boarding Pass Ready</Text>
          </View>
          <View className="bg-[#1E7A34] px-3 py-1.5" style={{ borderRadius: 4 }}>
            <Text className="text-white text-xs font-bold uppercase tracking-widest">View</Text>
          </View>
        </Pressable>

        {/* Timeline Structure */}
        <View className="pl-4">
          
          {/* Timeline Line */}
          <View className="absolute top-8 bottom-8 left-4 w-px bg-gray-300 ml-[3px]" />

          {/* Flight Node */}
          <View className="relative mb-8 pl-8">
            <View className="absolute top-6 -left-3.5 w-8 h-8 bg-white border border-gray-300 rounded-full items-center justify-center z-10">
              <Plane size={14} color="#0A0060" />
            </View>
            
            <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Oct 15 • 10:00 AM</Text>
            
            <Pressable onPress={openVoucher} className="bg-white border border-gray-200 p-5 active:bg-gray-50" style={{ borderRadius: 8 }}>
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest mb-1">British Airways</Text>
                  <Text className="text-gray-500 text-xs font-semibold">Booking Ref: DLX-9281</Text>
                </View>
                <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-sm">
                  <DownloadCloud size={12} color="#1E7A34" />
                  <Text className="text-[#1E7A34] text-[10px] font-bold uppercase tracking-widest ml-1">Cached</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-2xl font-black text-gray-900 tracking-tighter">Accra</Text>
                  <Text className="text-gray-500 font-semibold text-xs mt-1">Ghana</Text>
                </View>
                <View className="flex-1 items-center px-4">
                  <View className="h-[2px] w-full bg-gray-200 relative">
                    <View className="absolute -top-2.5 left-1/2 -ml-2.5 bg-white px-1">
                      <Plane size={16} color="#9CA3AF" />
                    </View>
                  </View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold mt-3 tracking-widest">Direct • 6h 30m</Text>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-black text-gray-900 tracking-tighter">London</Text>
                  <Text className="text-gray-500 font-semibold text-xs mt-1">United Kingdom</Text>
                </View>
              </View>

              <View className="flex-row justify-between border-t border-gray-100 pt-4">
                <View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Terminal</Text>
                  <Text className="text-gray-900 font-bold text-sm">T3</Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Gate</Text>
                  <Text className="text-gray-900 font-bold text-sm">--</Text>
                </View>
                <View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Seat</Text>
                  <Text className="text-gray-900 font-bold text-sm">12A</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Hotel Node */}
          <View className="relative mb-2 pl-8">
            <View className="absolute top-6 -left-3.5 w-8 h-8 bg-white border border-gray-300 rounded-full items-center justify-center z-10">
              <Bed size={14} color="#0A0060" />
            </View>

            <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Oct 15 • 3:00 PM</Text>
            
            <View className="bg-white border border-gray-200 p-5" style={{ borderRadius: 8 }}>
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                  <Text className="text-gray-900 font-black text-lg leading-tight mb-1">The Savoy London</Text>
                  <Text className="text-gray-500 text-xs font-semibold">Booking Ref: HTL-4491</Text>
                </View>
                <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-sm">
                  <DownloadCloud size={12} color="#1E7A34" />
                  <Text className="text-[#1E7A34] text-[10px] font-bold uppercase tracking-widest ml-1">Cached</Text>
                </View>
              </View>

              <View className="flex-row justify-between border-t border-gray-100 pt-4 mb-4">
                <View>
                  <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Check-in</Text>
                  <Text className="text-gray-900 font-bold text-sm">Oct 15</Text>
                </View>
                <View className="items-end">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Check-out</Text>
                  <Text className="text-gray-900 font-bold text-sm">Oct 22</Text>
                </View>
              </View>
              
              <Pressable className="bg-gray-100 items-center justify-center w-full" style={{ height: 40, borderRadius: 4 }}>
                <Text className="text-[#0A0060] font-black text-xs tracking-widest uppercase">View Map & Details</Text>
              </Pressable>
            </View>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
