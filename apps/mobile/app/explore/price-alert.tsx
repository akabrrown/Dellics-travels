import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Plane, Calendar } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SetPriceAlertScreen() {
  const router = useRouter();
  const [targetPrice, setTargetPrice] = useState('300');
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Alert Set', 'We will notify you when prices drop below your target.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Set Price Alert</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Route Info */}
        <View className="bg-white border border-gray-200 p-5 mb-8" style={{ borderRadius: 8 }}>
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="font-black text-xl text-gray-900">ACC</Text>
              <Text className="text-gray-500 text-xs font-semibold">Accra</Text>
            </View>
            <Plane size={24} color="#0A0060" />
            <View className="items-end">
              <Text className="font-black text-xl text-gray-900">DXB</Text>
              <Text className="text-gray-500 text-xs font-semibold">Dubai</Text>
            </View>
          </View>
          <View className="flex-row items-center bg-gray-50 p-3" style={{ borderRadius: 4 }}>
            <Calendar size={16} color="#0A0060" />
            <Text className="ml-2 text-sm font-bold text-[#0A0060]">Flexible Dates (Oct)</Text>
          </View>
        </View>

        {/* Target Price */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Target Price</Text>
        <View className="bg-white border border-gray-200 p-6 mb-8 items-center" style={{ borderRadius: 8 }}>
          <Text className="text-gray-500 text-sm font-semibold mb-4">Notify me when the price drops below:</Text>
          <View className="flex-row items-center">
            <Text className="text-3xl font-black text-gray-400 mr-2">$</Text>
            <TextInput
              value={targetPrice}
              onChangeText={setTargetPrice}
              keyboardType="number-pad"
              className="text-5xl font-black text-[#F4740D]"
              style={{ minWidth: 100 }}
              maxLength={4}
            />
          </View>
          <Text className="text-gray-400 text-xs mt-2">Current lowest: $450</Text>
        </View>

        {/* Notification Preferences */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Notify Via</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Text className="font-bold text-gray-900 text-sm">Push Notification</Text>
            <Switch
              value={notifyPush}
              onValueChange={(val) => { Haptics.selectionAsync(); setNotifyPush(val); }}
              trackColor={{ false: '#E5E7EB', true: '#0A0060' }}
              thumbColor="#ffffff"
            />
          </View>
          <View className="flex-row items-center justify-between p-4">
            <Text className="font-bold text-gray-900 text-sm">Email</Text>
            <Switch
              value={notifyEmail}
              onValueChange={(val) => { Haptics.selectionAsync(); setNotifyEmail(val); }}
              trackColor={{ false: '#E5E7EB', true: '#0A0060' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className={`flex-row items-center justify-center w-full ${saving ? 'bg-gray-400' : 'bg-[#0A0060]'}`}
          style={{ height: 56, borderRadius: 4 }}
        >
          <Bell size={20} color="white" />
          <Text className="text-white font-black text-sm tracking-widest uppercase ml-2">
            {saving ? 'Saving...' : 'Set Alert'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
