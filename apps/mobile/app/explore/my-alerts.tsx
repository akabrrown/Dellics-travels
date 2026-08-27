import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Plane, Trash2, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const INITIAL_ALERTS = [
  { id: '1', origin: 'ACC', dest: 'DXB', target: 300, current: 450, dates: 'Flexible (Oct)' },
  { id: '2', origin: 'LHR', dest: 'JFK', target: 500, current: 480, dates: 'Dec 15 - Jan 5', reached: true },
];

export default function MyAlertsScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Remove Alert', 'Are you sure you want to remove this price alert?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setAlerts(alerts.filter(a => a.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Price Alerts</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 ? (
          <View className="bg-white border border-gray-200 p-8 items-center" style={{ borderRadius: 8 }}>
            <Bell size={32} color="#D1D5DB" />
            <Text className="text-gray-500 font-bold text-sm mt-4 text-center">No active alerts.</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">Set alerts from the Explore map or Flight search results.</Text>
          </View>
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} className="bg-white border border-gray-200 p-4 mb-4" style={{ borderRadius: 8 }}>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="font-black text-xl text-gray-900">{alert.origin}</Text>
                  <ArrowRight size={16} color="#D1D5DB" className="mx-2" />
                  <Text className="font-black text-xl text-gray-900">{alert.dest}</Text>
                </View>
                <Pressable onPress={() => handleDelete(alert.id)} className="p-2 -mr-2">
                  <Trash2 size={18} color="#DC2626" />
                </Pressable>
              </View>

              <View className="flex-row items-end mb-4">
                <View className="flex-1">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Target</Text>
                  <Text className="text-[#F4740D] font-black text-2xl">${alert.target}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current</Text>
                  <Text className={`font-black text-2xl ${alert.reached ? 'text-green-600' : 'text-gray-900'}`}>
                    ${alert.current}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
                <Text className="text-sm font-bold text-[#0A0060]">{alert.dates}</Text>
                {alert.reached && (
                  <Pressable 
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push('/search/flights');
                    }}
                    className="bg-[#0A0060] px-4 py-2" 
                    style={{ borderRadius: 4 }}
                  >
                    <Text className="text-white font-black text-[10px] uppercase tracking-widest">Book Now</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
