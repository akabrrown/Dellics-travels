import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Plane, TrendingDown, CreditCard, Gift, MessageCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface NotificationPref {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  enabled: boolean;
}

export default function NotificationPrefsScreen() {
  const router = useRouter();

  const [prefs, setPrefs] = useState<NotificationPref[]>([
    { id: 'booking', icon: Plane, title: 'Booking Updates', subtitle: 'Confirmations, changes, and cancellations', enabled: true },
    { id: 'flight', icon: Bell, title: 'Flight Status', subtitle: 'Delays, gate changes, and boarding alerts', enabled: true },
    { id: 'price', icon: TrendingDown, title: 'Price Drops', subtitle: 'Alerts for your saved routes and destinations', enabled: true },
    { id: 'deals', icon: Gift, title: 'Deals & Promotions', subtitle: 'Exclusive offers and flash sales', enabled: false },
    { id: 'payment', icon: CreditCard, title: 'Payment Receipts', subtitle: 'Transaction confirmations and refunds', enabled: true },
    { id: 'chat', icon: MessageCircle, title: 'Support Messages', subtitle: 'Replies from the Dellics support team', enabled: true },
  ]);

  const togglePref = (id: string, value: boolean) => {
    Haptics.selectionAsync();
    setPrefs(prefs.map(p => p.id === id ? { ...p, enabled: value } : p));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Push Notifications</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          {prefs.map((pref, index) => (
            <View
              key={pref.id}
              className={`flex-row items-center justify-between p-4 ${index !== prefs.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View className="flex-row items-center flex-1 mr-4">
                <pref.icon size={20} color="#0A0060" />
                <View className="flex-1 ml-4">
                  <Text className="text-sm font-bold text-gray-900">{pref.title}</Text>
                  <Text className="text-xs font-semibold text-gray-500 mt-0.5">{pref.subtitle}</Text>
                </View>
              </View>
              <Switch
                value={pref.enabled}
                onValueChange={(val) => togglePref(pref.id, val)}
                trackColor={{ false: '#E5E7EB', true: '#0A0060' }}
                thumbColor="#ffffff"
              />
            </View>
          ))}
        </View>

        <Text className="text-gray-400 text-xs font-semibold mt-6 px-1 leading-relaxed">
          You can also manage notification permissions in your device settings. Disabling "Booking Updates" is not recommended — you may miss critical travel information.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
