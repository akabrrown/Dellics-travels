import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Info, ChevronRight, CheckCircle2 } from 'lucide-react-native';

export default function ReviewBookingScreen() {
  const router = useRouter();
  const { type, price, title } = useLocalSearchParams<{ type: string, price: string, title: string }>();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ChevronLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 ml-2">Review Booking</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Item Summary */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-[#0A0060]/10 items-center justify-center mr-3">
              <CheckCircle2 color="#0A0060" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest">{type} Booking</Text>
              <Text className="text-lg font-black text-gray-900">{title}</Text>
            </View>
          </View>
          <View className="h-px bg-gray-200 mb-4" />
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Dates</Text>
            <Text className="font-bold text-gray-900">Aug 15 - Aug 16</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Travelers</Text>
            <Text className="font-bold text-gray-900">1 Adult</Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <Text className="text-sm font-bold text-gray-900 mb-4">Price Breakdown</Text>
        <View className="mb-8">
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Base fare</Text>
            <Text className="font-medium text-gray-900">${Number(price) - 50}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">Taxes & Fees</Text>
            <Text className="font-medium text-gray-900">$50</Text>
          </View>
          <View className="h-px bg-gray-100 my-3" />
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">Total Price</Text>
            <Text className="text-2xl font-black text-[#F4740D]">${price}</Text>
          </View>
        </View>

        {/* Policy Notice */}
        <View className="bg-blue-50 p-4 rounded-xl flex-row items-start mb-8">
          <Info color="#2563eb" size={20} className="mr-3" />
          <Text className="flex-1 text-blue-900 text-sm leading-5">
            By proceeding, you agree to our terms of service and the cancellation policy associated with this booking.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 bg-white border-t border-gray-100 pb-8">
        <Pressable 
          onPress={() => router.push({ pathname: '/checkout/guests', params: { type, price, title } })}
          className="bg-[#0A0060] w-full py-4 rounded-xl flex-row items-center justify-center"
        >
          <Text className="text-white font-bold mr-2 text-lg">Continue to Guest Details</Text>
          <ChevronRight color="white" size={18} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
