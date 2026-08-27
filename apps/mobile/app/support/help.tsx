import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp, Search, MessageCircle, Mail, Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const FAQ_DATA = [
  {
    category: 'Booking & Payments',
    items: [
      { q: 'How do I cancel a booking?', a: 'Go to Trips → select the trip → tap the overflow menu on the booking entry → Cancel. Refund policies vary by provider and fare class.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–10 business days to your original payment method, depending on your bank.' },
      { q: 'Can I change my travel dates?', a: 'Date changes depend on the fare rules. Go to your Trip Detail screen and tap "Change" on the relevant booking.' },
    ],
  },
  {
    category: 'eSIM',
    items: [
      { q: 'How do I activate my eSIM?', a: 'After purchase, go to My eSIMs → select the plan → scan the QR code in your device Settings under Cellular/Mobile Data.' },
      { q: 'Which devices support eSIM?', a: 'Most phones from 2019 onward support eSIM (iPhone XR+, Samsung S20+, Pixel 3+). Check your device specifications.' },
    ],
  },
  {
    category: 'Account',
    items: [
      { q: 'How do I reset my password?', a: 'Tap "Forgot Password" on the login screen. You\'ll receive a reset link via email.' },
      { q: 'Can I delete my account?', a: 'Contact support at info@dellicstravels.com to request permanent account deletion. All data will be erased within 30 days.' },
    ],
  },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    Haptics.selectionAsync();
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredData = FAQ_DATA.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Help Center</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Search */}
        <View className="flex-row items-center bg-white border border-gray-200 px-4 mb-8" style={{ height: 48, borderRadius: 8 }}>
          <Search size={18} color="#D1D5DB" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search for help..."
            className="flex-1 ml-3 text-sm font-bold text-gray-900"
          />
        </View>

        {/* FAQ Sections */}
        {filteredData.map((section) => (
          <View key={section.category} className="mb-8">
            <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">{section.category}</Text>
            <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
              {section.items.map((item, index) => {
                const itemId = `${section.category}-${index}`;
                const isExpanded = expandedId === itemId;
                return (
                  <View key={itemId}>
                    <Pressable
                      onPress={() => toggleExpand(itemId)}
                      className={`flex-row items-center justify-between p-4 ${index !== section.items.length - 1 || isExpanded ? 'border-b border-gray-100' : ''}`}
                    >
                      <Text className="font-bold text-gray-900 text-sm flex-1 mr-4">{item.q}</Text>
                      {isExpanded ? <ChevronUp size={18} color="#0A0060" /> : <ChevronDown size={18} color="#D1D5DB" />}
                    </Pressable>
                    {isExpanded && (
                      <View className={`px-4 pb-4 pt-2 bg-gray-50 ${index !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <Text className="text-gray-600 text-sm leading-relaxed">{item.a}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Contact */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Contact Us</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/support/chat'); }}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <MessageCircle size={20} color="#0A0060" />
            <View className="flex-1 ml-4">
              <Text className="font-bold text-gray-900 text-sm">Live Chat</Text>
              <Text className="text-gray-400 text-xs font-semibold">Available Mon-Sat, 8AM-6PM GMT</Text>
            </View>
          </Pressable>
          <Pressable className="flex-row items-center p-4 border-b border-gray-100">
            <Mail size={20} color="#0A0060" />
            <View className="flex-1 ml-4">
              <Text className="font-bold text-gray-900 text-sm">Email</Text>
              <Text className="text-gray-400 text-xs font-semibold">info@dellicstravels.com</Text>
            </View>
          </Pressable>
          <Pressable className="flex-row items-center p-4">
            <Phone size={20} color="#0A0060" />
            <View className="flex-1 ml-4">
              <Text className="font-bold text-gray-900 text-sm">Phone</Text>
              <Text className="text-gray-400 text-xs font-semibold">+233 55 205 4174</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
