import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Copy, Share2, Users, Gift, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

const REFERRAL_CODE = 'DELLICS-KOF2X';
const REFERRAL_LINK = `https://dellicstravels.com/r/${REFERRAL_CODE}`;

const REFERRALS = [
  { id: '1', name: 'Kwame A.', status: 'Completed', reward: '+500 pts', date: 'Jul 29, 2026' },
  { id: '2', name: 'Ama B.', status: 'Pending', reward: '—', date: 'Aug 3, 2026' },
];

export default function ReferralScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Clipboard.setStringAsync(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Join me on Dellics Travels and get 500 bonus points on your first booking! Use my link: ${REFERRAL_LINK}`,
      });
    } catch {}
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Invite Friends</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Offer Card */}
        <View className="bg-[#0A0060] p-6 mb-8" style={{ borderRadius: 8 }}>
          <View className="flex-row items-center mb-3">
            <Gift size={24} color="#F4740D" />
            <Text className="text-white font-black text-lg ml-3">Give 500, Get 500</Text>
          </View>
          <Text className="text-white/70 text-sm leading-relaxed">
            Invite a friend to Dellics Travels. When they complete their first booking, you both earn 500 reward points.
          </Text>
        </View>

        {/* Code + Actions */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Your Invite Code</Text>
        <View className="bg-white border border-gray-200 p-5 mb-6" style={{ borderRadius: 8 }}>
          <Text className="text-center text-2xl font-black text-[#0A0060] tracking-[6px] mb-5">{REFERRAL_CODE}</Text>
          <View className="flex-row">
            <Pressable
              onPress={handleCopy}
              className={`flex-1 flex-row items-center justify-center mr-2 ${copied ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'} border`}
              style={{ height: 48, borderRadius: 4 }}
            >
              {copied ? <CheckCircle2 size={16} color="#16a34a" /> : <Copy size={16} color="#0A0060" />}
              <Text className={`font-black text-xs uppercase tracking-widest ml-2 ${copied ? 'text-green-700' : 'text-[#0A0060]'}`}>
                {copied ? 'Copied' : 'Copy Link'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              className="flex-1 flex-row items-center justify-center bg-[#0A0060]"
              style={{ height: 48, borderRadius: 4 }}
            >
              <Share2 size={16} color="white" />
              <Text className="text-white font-black text-xs uppercase tracking-widest ml-2">Share</Text>
            </Pressable>
          </View>
        </View>

        {/* Referral Status */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Referral Status</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          {REFERRALS.length === 0 ? (
            <View className="p-8 items-center">
              <Users size={32} color="#D1D5DB" />
              <Text className="text-gray-500 font-bold text-sm mt-4">No referrals yet.</Text>
            </View>
          ) : (
            REFERRALS.map((ref, index) => (
              <View
                key={ref.id}
                className={`flex-row items-center p-4 ${index !== REFERRALS.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="w-10 h-10 bg-[#0A0060]/10 items-center justify-center mr-4" style={{ borderRadius: 4 }}>
                  <Text className="text-[#0A0060] font-black text-sm">{ref.name.charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 text-sm">{ref.name}</Text>
                  <Text className="text-gray-400 text-xs font-semibold mt-0.5">{ref.date}</Text>
                </View>
                <View className={`px-2 py-1 ${ref.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'}`} style={{ borderRadius: 4 }}>
                  <Text className={`text-[10px] font-black uppercase tracking-widest ${ref.status === 'Completed' ? 'text-green-700' : 'text-yellow-700'}`}>
                    {ref.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
