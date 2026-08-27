import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Globe, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const LANGUAGES = [
  { code: 'en', label: 'English', region: 'United Kingdom' },
  { code: 'fr', label: 'Français', region: 'France' },
  { code: 'es', label: 'Español', region: 'Spain' },
  { code: 'de', label: 'Deutsch', region: 'Germany' },
  { code: 'ar', label: 'العربية', region: 'Arabic' },
  { code: 'zh', label: '中文', region: 'China' },
];

const CURRENCIES = [
  { code: 'GHS', symbol: '₵', label: 'Ghanaian Cedi' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
];

export default function LanguageCurrencyScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('GHS');

  const handleLangSelect = (code: string) => {
    Haptics.selectionAsync();
    setSelectedLang(code);
  };

  const handleCurrencySelect = (code: string) => {
    Haptics.selectionAsync();
    setSelectedCurrency(code);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Language & Currency</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Language</Text>
        <View className="bg-white border border-gray-200 mb-8" style={{ borderRadius: 8 }}>
          {LANGUAGES.map((lang, index) => (
            <Pressable
              key={lang.code}
              onPress={() => handleLangSelect(lang.code)}
              className={`flex-row items-center justify-between p-4 ${index !== LANGUAGES.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View className="flex-row items-center">
                <Globe size={18} color={selectedLang === lang.code ? '#0A0060' : '#D1D5DB'} />
                <View className="ml-4">
                  <Text className={`text-sm font-bold ${selectedLang === lang.code ? 'text-[#0A0060]' : 'text-gray-900'}`}>{lang.label}</Text>
                  <Text className="text-gray-400 text-xs font-semibold">{lang.region}</Text>
                </View>
              </View>
              {selectedLang === lang.code && (
                <View className="w-6 h-6 bg-[#0A0060] items-center justify-center" style={{ borderRadius: 4 }}>
                  <Check size={14} color="white" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Display Currency</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          {CURRENCIES.map((curr, index) => (
            <Pressable
              key={curr.code}
              onPress={() => handleCurrencySelect(curr.code)}
              className={`flex-row items-center justify-between p-4 ${index !== CURRENCIES.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-gray-100 items-center justify-center mr-4" style={{ borderRadius: 4 }}>
                  <Text className={`font-black text-sm ${selectedCurrency === curr.code ? 'text-[#0A0060]' : 'text-gray-500'}`}>{curr.symbol}</Text>
                </View>
                <View>
                  <Text className={`text-sm font-bold ${selectedCurrency === curr.code ? 'text-[#0A0060]' : 'text-gray-900'}`}>{curr.label}</Text>
                  <Text className="text-gray-400 text-xs font-semibold">{curr.code}</Text>
                </View>
              </View>
              {selectedCurrency === curr.code && (
                <View className="w-6 h-6 bg-[#0A0060] items-center justify-center" style={{ borderRadius: 4 }}>
                  <Check size={14} color="white" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
