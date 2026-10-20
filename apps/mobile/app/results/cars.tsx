import React from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Car } from 'lucide-react-native';

export default function CarResults() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <Pressable onPress={() => router.back()} className="p-2 mr-2 bg-gray-50 rounded-full">
          <ArrowLeft size={20} color="#0A0060" />
        </Pressable>
        <Text className="text-lg font-black text-[#0A0060]">Cars</Text>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-16 h-16 bg-[#0A0060]/5 rounded-full items-center justify-center mb-4">
          <Car size={24} color="#0A0060" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2">Car Results Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}
