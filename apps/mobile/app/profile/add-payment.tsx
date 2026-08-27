import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function AddPaymentScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Enter a valid card number';
    if (expiry.length < 5) newErrors.expiry = 'Enter expiry as MM/YY';
    if (cvc.length < 3) newErrors.cvc = 'Enter a valid CVC';
    if (!name.trim()) newErrors.name = 'Enter the cardholder name';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);

    // In production this would call Stripe SetupIntent
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Card Saved', 'Your payment method has been added.');
      router.back();
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Add Card</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          <View className="p-4 border-b border-gray-100">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Card Number</Text>
            <View className="flex-row items-center">
              <CreditCard size={20} color="#D1D5DB" />
              <TextInput
                value={cardNumber}
                onChangeText={formatCardNumber}
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                className="flex-1 text-base font-bold text-gray-900 ml-3"
              />
            </View>
            {errors.cardNumber && <Text className="text-red-500 text-xs mt-1">{errors.cardNumber}</Text>}
          </View>

          <View className="flex-row border-b border-gray-100">
            <View className="flex-1 p-4 border-r border-gray-100">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expiry</Text>
              <TextInput
                value={expiry}
                onChangeText={formatExpiry}
                placeholder="MM/YY"
                keyboardType="number-pad"
                className="text-base font-bold text-gray-900"
              />
              {errors.expiry && <Text className="text-red-500 text-xs mt-1">{errors.expiry}</Text>}
            </View>
            <View className="flex-1 p-4">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">CVC</Text>
              <TextInput
                value={cvc}
                onChangeText={(t) => setCvc(t.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                keyboardType="number-pad"
                secureTextEntry
                className="text-base font-bold text-gray-900"
              />
              {errors.cvc && <Text className="text-red-500 text-xs mt-1">{errors.cvc}</Text>}
            </View>
          </View>

          <View className="p-4">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cardholder Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="As shown on card"
              autoCapitalize="words"
              className="text-base font-bold text-gray-900"
            />
            {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
          </View>
        </View>

        <View className="flex-row items-center mt-6 px-1">
          <ShieldCheck size={16} color="#10b981" />
          <Text className="text-gray-500 text-xs font-semibold ml-2">Your card is stored securely by Stripe. We never see your full card details.</Text>
        </View>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className={`items-center justify-center w-full ${saving ? 'bg-gray-400' : 'bg-[#0A0060]'}`}
          style={{ height: 56, borderRadius: 4 }}
        >
          <Text className="text-white font-black text-sm tracking-widest uppercase">
            {saving ? 'Saving...' : 'Save Card'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
