import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Plus, ChevronRight, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const SAVED_CARDS = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '12/28', isDefault: true },
  { id: '2', brand: 'Mastercard', last4: '8210', expiry: '03/27', isDefault: false },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();

  const handleSetDefault = (cardId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Default Set', `Card ending in •••• is now your default.`);
  };

  const handleDelete = (cardId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Remove Card', 'Are you sure you want to remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Payment Methods</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Saved Cards</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          {SAVED_CARDS.map((card, index) => (
            <Pressable
              key={card.id}
              onPress={() => handleSetDefault(card.id)}
              className={`flex-row items-center p-4 ${index !== SAVED_CARDS.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View className="w-12 h-8 bg-gray-100 items-center justify-center mr-4" style={{ borderRadius: 4 }}>
                <CreditCard size={18} color="#0A0060" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="font-bold text-gray-900 text-sm">{card.brand} •••• {card.last4}</Text>
                  {card.isDefault && (
                    <View className="ml-2 bg-[#0A0060]/10 px-2 py-0.5" style={{ borderRadius: 4 }}>
                      <Text className="text-[#0A0060] text-[10px] font-black uppercase tracking-widest">Default</Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-500 text-xs font-semibold mt-0.5">Expires {card.expiry}</Text>
              </View>
              <Pressable onPress={() => handleDelete(card.id)} className="p-2 -mr-2">
                <Trash2 size={18} color="#DC2626" />
              </Pressable>
            </Pressable>
          ))}
        </View>

        {/* Add New */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/profile/add-payment');
          }}
          className="flex-row items-center justify-center bg-white border border-dashed border-gray-300 mt-6"
          style={{ height: 56, borderRadius: 8 }}
        >
          <Plus size={20} color="#0A0060" />
          <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest ml-2">Add Payment Method</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
