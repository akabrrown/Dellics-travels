import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Ticket } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title: string }>();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-8">
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6 shadow-sm shadow-green-100">
          <CheckCircle2 color="#10b981" size={48} />
        </View>

        <Text className="text-3xl font-black text-gray-900 mb-2 text-center">Booking Confirmed!</Text>
        <Text className="text-gray-500 text-center mb-8 leading-6 text-base">
          Your reservation for <Text className="font-bold text-gray-700">{title}</Text> has been successful. We've sent the confirmation and receipt to your email.
        </Text>

        <View className="bg-gray-50 w-full p-6 rounded-2xl border border-gray-100 items-center">
          <Ticket color="#6B7280" size={32} className="mb-3" />
          <Text className="text-gray-500 text-sm mb-1 uppercase tracking-widest font-bold">Booking Reference</Text>
          <Text className="text-2xl font-black text-[#0A0060] tracking-widest">DTA-8392X</Text>
        </View>
      </View>

      <View className="p-6 bg-white border-t border-gray-100 pb-8">
        <Pressable 
          onPress={() => router.replace('/(tabs)/')}
          className="bg-gray-100 w-full py-4 rounded-xl items-center justify-center mb-4"
        >
          <Text className="text-gray-900 font-bold text-lg">Back to Home</Text>
        </Pressable>
        <Pressable 
          onPress={() => router.push('/(tabs)/trips')}
          className="bg-[#0A0060] w-full py-4 rounded-xl items-center justify-center"
        >
          <Text className="text-white font-bold text-lg">View My Trips</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
