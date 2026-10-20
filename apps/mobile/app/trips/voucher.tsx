import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, QrCode, Plane, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function VoucherScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#0A0060]">
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between">
        <Text className="text-white font-black text-lg">Boarding Pass</Text>
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.canGoBack() ? router.back() : router.replace('/');
          }}
          className="p-2 -mr-2"
        >
          <X size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Pass Card */}
        <View className="bg-white rounded-xl overflow-hidden shadow-2xl mb-6">
          
          {/* Top Section */}
          <View className="bg-white p-6 pb-4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[#0A0060] font-black text-base uppercase tracking-widest">British Airways</Text>
              <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest">BA081</Text>
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-black text-gray-900 tracking-tighter">Accra</Text>
                <Text className="text-gray-500 font-semibold text-xs mt-1">Ghana</Text>
              </View>
              <View className="flex-1 items-center px-4">
                <Plane size={24} color="#0A0060" />
              </View>
              <View className="items-end">
                <Text className="text-2xl font-black text-gray-900 tracking-tighter">London</Text>
                <Text className="text-gray-500 font-semibold text-xs mt-1">United Kingdom</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View className="relative h-4 bg-white flex-row items-center overflow-hidden">
            <View className="absolute -left-2 w-4 h-4 rounded-full bg-[#0A0060]" />
            <View className="flex-1 h-[2px] bg-gray-200 border-dashed border-t-2 border-gray-200" style={{ borderStyle: 'dashed' }} />
            <View className="absolute -right-2 w-4 h-4 rounded-full bg-[#0A0060]" />
          </View>

          {/* Passenger Details */}
          <View className="bg-white p-6 pt-4">
            <View className="flex-row mb-6">
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Passenger</Text>
                <Text className="text-gray-900 font-bold text-base">John Doe</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Date</Text>
                <Text className="text-gray-900 font-bold text-base">15 Oct 2026</Text>
              </View>
            </View>

            <View className="flex-row mb-8">
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Flight</Text>
                <Text className="text-gray-900 font-bold text-base">BA081</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Gate</Text>
                <Text className="text-gray-900 font-bold text-base">--</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Seat</Text>
                <Text className="text-gray-900 font-bold text-base">12A</Text>
              </View>
            </View>

            <View className="items-center justify-center py-6 bg-gray-50 rounded-lg border border-gray-100">
              {/* Dummy QR Code */}
              <QrCode size={160} color="#111827" strokeWidth={1} />
              <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-4">Booking Ref: DLX-9281</Text>
            </View>
          </View>
          
        </View>

        <View className="flex-row items-center justify-center px-4 mb-10">
          <Info size={16} color="#9CA3AF" />
          <Text className="text-gray-300 font-semibold text-xs ml-2 text-center">
            Cached for offline use. Present this QR code at the gate.
          </Text>
        </View>

      </ScrollView>

      {/* Footer Action */}
      <View className="absolute bottom-10 left-6 right-6">
        <Pressable 
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          className="bg-black py-4 items-center justify-center rounded-lg flex-row"
        >
          <Text className="text-white font-black text-sm uppercase tracking-widest ml-2">Add to Apple Wallet</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
