import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Plane, Clock, Info, Check, CheckCircle2, BaggageClaim, Briefcase, Grid, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type FareClass = 'economy' | 'premium' | 'business';

export default function FlightDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedFare, setSelectedFare] = useState<FareClass>('economy');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/flights/passengers?flightId=${id}&fare=${selectedFare}&seat=${selectedSeat || ''}`);
  };

  const handleOpenSeatSelection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/flights/seat-selection?flightId=${id}&fare=${selectedFare}`);
  };

  const getFarePrice = () => {
    if (selectedFare === 'business') return 1250;
    if (selectedFare === 'premium') return 850;
    return 550; // economy
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView edges={['top']} className="bg-[#0A0060]" />
      
      {/* Header */}
      <View className="bg-[#0A0060] px-4 py-4 pb-8 flex-row items-center border-b border-[#0A0060]">
        <Pressable 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
          className="p-2 mr-2 -ml-2"
        >
          <ChevronLeft size={24} color="#FFF" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-black text-white">Flight & Fare Details</Text>
          <Text className="text-sm font-semibold text-blue-200">Accra to London • Direct Flight</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* Flight Timeline Card */}
        <View className="bg-white rounded-[16px] p-5 mt-[-20px] mb-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full">
              <Plane size={14} color="#0A0060" className="mr-1.5" />
              <Text className="text-[#0A0060] font-bold text-xs">Delta Air Lines · Flight DL 432</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={14} color="#6B7280" className="mr-1.5" />
              <Text className="text-gray-500 font-semibold text-xs">6 hours 30 mins</Text>
            </View>
          </View>

          {/* Origin */}
          <View className="flex-row">
            <View className="items-center mr-4 w-6">
              <View className="w-3 h-3 rounded-full bg-[#0A0060]" />
              <View className="w-px h-12 bg-gray-200 my-1" />
            </View>
            <View className="flex-1 pb-6">
              <Text className="text-lg font-black text-gray-900 leading-none mb-1">08:00 AM</Text>
              <Text className="text-sm text-gray-500 font-medium">Accra (Kotoka Int. Terminal 3)</Text>
            </View>
          </View>

          {/* Destination */}
          <View className="flex-row">
            <View className="items-center mr-4 w-6">
              <View className="w-3 h-3 rounded-full border-2 border-[#0A0060] bg-white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-black text-gray-900 leading-none mb-1">02:30 PM</Text>
              <Text className="text-sm text-gray-500 font-medium">London (Heathrow Terminal 4)</Text>
            </View>
          </View>

          {/* Seat Map Quick Entry */}
          <Pressable
            onPress={handleOpenSeatSelection}
            className="mt-4 pt-4 border-t border-gray-100 flex-row items-center justify-between bg-gray-50 p-3 rounded-xl"
          >
            <View className="flex-row items-center">
              <Grid size={18} color="#0A0060" />
              <View className="ml-3">
                <Text className="font-black text-[#0A0060] text-sm">Interactive Seat Map</Text>
                <Text className="text-xs text-gray-500 font-semibold">
                  {selectedSeat ? `Assigned Seat: ${selectedSeat}` : 'Pick your preferred seat now'}
                </Text>
              </View>
            </View>
            <Text className="text-[#F4740D] font-black text-xs uppercase">Select Seat →</Text>
          </Pressable>
        </View>

        {/* Fare Classes */}
        <Text className="text-lg font-black text-[#0A0060] mb-4 ml-1">Select Fare Class</Text>
        
        {/* Economy */}
        <Pressable 
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedFare('economy'); }}
          className={`bg-white rounded-[16px] p-5 mb-4 border-2 ${selectedFare === 'economy' ? 'border-[#0A0060]' : 'border-gray-100'}`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-black text-gray-900">Standard Economy</Text>
              <Text className="text-sm text-gray-500 font-semibold mt-0.5">Essential travel features</Text>
            </View>
            <View className="items-end">
              <Text className="text-xl font-black text-[#0A0060]">$550</Text>
              {selectedFare === 'economy' && <CheckCircle2 size={20} color="#0A0060" className="mt-1" />}
            </View>
          </View>
          <View className="flex-row items-center mb-2">
            <Briefcase size={16} color="#4B5563" className="mr-2" />
            <Text className="text-sm text-gray-600 font-medium">1 Personal item + 1 Cabin bag (7kg)</Text>
          </View>
          <View className="flex-row items-center">
            <Info size={16} color="#DC2626" className="mr-2" />
            <Text className="text-sm text-red-600 font-medium">Non-refundable fare</Text>
          </View>
        </Pressable>

        {/* Premium Economy */}
        <Pressable 
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedFare('premium'); }}
          className={`bg-white rounded-[16px] p-5 mb-4 border-2 ${selectedFare === 'premium' ? 'border-[#0A0060]' : 'border-gray-100'}`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-black text-gray-900">Premium Economy</Text>
              <Text className="text-sm text-gray-500 font-semibold mt-0.5">Extra legroom and checked baggage</Text>
            </View>
            <View className="items-end">
              <Text className="text-xl font-black text-[#0A0060]">$850</Text>
              {selectedFare === 'premium' && <CheckCircle2 size={20} color="#0A0060" className="mt-1" />}
            </View>
          </View>
          <View className="flex-row items-center mb-2">
            <BaggageClaim size={16} color="#1E7A34" className="mr-2" />
            <Text className="text-sm text-gray-600 font-medium">1 Checked bag included (23kg)</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Grid size={16} color="#4B5563" className="mr-2" />
            <Text className="text-sm text-gray-600 font-medium">Standard seat selection included</Text>
          </View>
          <View className="flex-row items-center">
            <ShieldCheck size={16} color="#1E7A34" className="mr-2" />
            <Text className="text-sm text-green-700 font-medium">Flexible changes allowed</Text>
          </View>
        </Pressable>

        {/* Business Class */}
        <Pressable 
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedFare('business'); }}
          className={`bg-white rounded-[16px] p-5 mb-4 border-2 ${selectedFare === 'business' ? 'border-[#0A0060]' : 'border-gray-100'}`}
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-black text-gray-900">Business Class</Text>
              <Text className="text-sm text-gray-500 font-semibold mt-0.5">Lie-flat seats and VIP lounge access</Text>
            </View>
            <View className="items-end">
              <Text className="text-xl font-black text-[#0A0060]">$1,250</Text>
              {selectedFare === 'business' && <CheckCircle2 size={20} color="#0A0060" className="mt-1" />}
            </View>
          </View>
          <View className="flex-row items-center mb-2">
            <BaggageClaim size={16} color="#1E7A34" className="mr-2" />
            <Text className="text-sm text-gray-600 font-medium">2 Checked bags included (32kg each)</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Check size={16} color="#1E7A34" className="mr-2" />
            <Text className="text-sm text-gray-600 font-medium">Priority boarding & VIP lounge access</Text>
          </View>
          <View className="flex-row items-center">
            <ShieldCheck size={16} color="#1E7A34" className="mr-2" />
            <Text className="text-sm text-green-700 font-medium">100% Refundable prior to departure</Text>
          </View>
        </Pressable>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pt-4 pb-8 flex-row justify-between items-center shadow-lg">
        <View>
          <Text className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Price</Text>
          <Text className="text-3xl font-black text-[#0A0060] leading-none">${getFarePrice()}</Text>
        </View>
        <Pressable 
          onPress={handleContinue}
          className="bg-[#0A0060] h-14 px-8 items-center justify-center rounded-[8px]"
        >
          <Text className="text-white font-black text-sm uppercase tracking-widest">Continue</Text>
        </Pressable>
      </View>

    </View>
  );
}
