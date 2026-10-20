import React from 'react';
import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Crown, Check, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const TIERS = [
  {
    name: 'Explorer',
    points: '0 - 2,499 pts',
    color: '#374151', // gray-700
    benefits: ['1x points on bookings', 'Standard support', 'Member-only fares'],
    current: true,
  },
  {
    name: 'Voyager',
    points: '2,500 - 9,999 pts',
    color: '#0A0060', // brand blue
    benefits: ['1.5x points on bookings', 'Priority support', 'Free cancellations', 'Early access to deals'],
    current: false,
  },
  {
    name: 'Elite',
    points: '10,000+ pts',
    color: '#F4740D', // brand orange
    benefits: ['2x points on bookings', 'Dedicated concierge', 'Free airport lounge access', 'Complimentary upgrades'],
    current: false,
  },
];

export default function MembershipBenefits() {
  const router = useRouter();
  
  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="flex-row items-center px-4 py-4 border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Membership Tiers</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-[#0A0060]/10 rounded-full items-center justify-center mb-4">
            <Crown size={32} color="#F4740D" />
          </View>
          <Text className="text-2xl font-black text-gray-900 text-center leading-tight mb-2">
            Unlock More With Every Trip
          </Text>
          <Text className="text-center text-gray-500 font-semibold leading-relaxed">
            Earn points on flights, hotels, and packages to climb the tiers and unlock exclusive benefits.
          </Text>
        </View>

        {TIERS.map((tier, index) => (
          <View 
            key={tier.name} 
            className="bg-white border mb-4 overflow-hidden" 
            style={{ borderRadius: 8, borderColor: tier.current ? tier.color : '#E5E7EB' }}
          >
            {tier.current && (
              <View className="bg-gray-100 py-1.5 items-center border-b border-gray-200">
                <Text className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Current Tier</Text>
              </View>
            )}
            <View className="p-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl font-black" style={{ color: tier.color }}>{tier.name}</Text>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">{tier.points}</Text>
              </View>
              
              <View>
                {tier.benefits.map((benefit, i) => (
                  <View key={i} className="flex-row items-start mb-3">
                    <Check size={16} color={tier.color} className="mr-3 mt-0.5" />
                    <Text className="text-gray-700 font-semibold text-sm leading-relaxed flex-1">{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/membership/rewards');
          }}
          className="mt-4 bg-[#0A0060] flex-row items-center justify-between px-6"
          style={{ height: 56, borderRadius: 8 }}
        >
          <Text className="text-white font-black text-sm uppercase tracking-widest">View My Rewards</Text>
          <ArrowRight size={20} color="white" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
