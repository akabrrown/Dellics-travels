import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Crown, ArrowUpRight, ArrowDownLeft, Gift } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const HISTORY = [
  { id: '1', type: 'earn', label: 'Flight ACC → LHR', points: 850, date: 'Aug 10, 2026' },
  { id: '2', type: 'earn', label: 'Hotel — Ritz-Carlton Dubai', points: 320, date: 'Aug 8, 2026' },
  { id: '3', type: 'redeem', label: 'Discount on Car Rental', points: -200, date: 'Aug 5, 2026' },
  { id: '4', type: 'earn', label: 'Referral Bonus — Kwame A.', points: 500, date: 'Jul 29, 2026' },
  { id: '5', type: 'earn', label: 'Flight ACC → JFK', points: 1200, date: 'Jul 15, 2026' },
];

export default function RewardsScreen() {
  const router = useRouter();
  const totalPoints = 2670;

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Rewards & Points</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View className="bg-[#0A0060] p-6 mb-8" style={{ borderRadius: 8 }}>
          <View className="flex-row items-center mb-2">
            <Crown size={20} color="#F4740D" />
            <Text className="text-white/60 font-black text-xs uppercase tracking-widest ml-2">Points Balance</Text>
          </View>
          <Text className="text-white text-5xl font-black tracking-tighter mb-6">{totalPoints.toLocaleString()}</Text>

          <View className="flex-row">
            <View className="flex-1 mr-2">
              <Text className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">Earned This Month</Text>
              <Text className="text-white font-black text-lg">+1,170</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white/40 font-bold text-[10px] uppercase tracking-widest mb-1">Redeemed</Text>
              <Text className="text-[#F4740D] font-black text-lg">-200</Text>
            </View>
          </View>
        </View>

        {/* Redeem CTA */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          className="bg-white border border-[#0A0060] flex-row items-center justify-center mb-8"
          style={{ height: 56, borderRadius: 4 }}
        >
          <Gift size={20} color="#0A0060" />
          <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest ml-2">Redeem Points</Text>
        </Pressable>

        {/* History */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">History</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          {HISTORY.map((entry, index) => (
            <View
              key={entry.id}
              className={`flex-row items-center p-4 ${index !== HISTORY.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View className={`w-10 h-10 items-center justify-center mr-4 ${entry.type === 'earn' ? 'bg-green-100' : 'bg-red-100'}`} style={{ borderRadius: 4 }}>
                {entry.type === 'earn' ? (
                  <ArrowDownLeft size={18} color="#16a34a" />
                ) : (
                  <ArrowUpRight size={18} color="#DC2626" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-sm">{entry.label}</Text>
                <Text className="text-gray-400 text-xs font-semibold mt-0.5">{entry.date}</Text>
              </View>
              <Text className={`font-black text-sm ${entry.points > 0 ? 'text-green-700' : 'text-red-600'}`}>
                {entry.points > 0 ? '+' : ''}{entry.points}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
