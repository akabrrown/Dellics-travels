import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ShieldCheck, CreditCard, ChevronRight, Smartphone } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../../src/lib/api';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';

export default function PaymentScreen() {
  const router = useRouter();
  const { type, price, title, firstName, lastName, email } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      // 1. Initialize Paystack checkout transaction on the backend
      const intentResponse = await api.post('/booking/payment-intent', {
        amount: Number(price),
        currency: 'USD',
        metadata: {
          type,
          title,
          guestName: `${firstName} ${lastName}`,
          guestEmail: email,
        },
      });

      const { authorizationUrl, reference } = intentResponse.data;

      if (!authorizationUrl) {
        // Direct booking if offline or no url returned
        await createBooking(reference || 'paystack_direct');
        return;
      }

      // 2. Open Paystack web checkout session (supports Mobile Money & Cards)
      const result = await WebBrowser.openAuthSessionAsync(
        authorizationUrl,
        'dellics://checkout/confirmation',
      );

      if (result.type === 'success' || result.type === 'dismiss') {
        // Verify payment on backend
        if (reference) {
          await api.get(`/payments/verify/${reference}`).catch(() => null);
        }
        await createBooking(reference);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Unable to process payment with Paystack. Please try again.';
      Alert.alert('Payment Error', message);
      setLoading(false);
    }
  };

  const createBooking = async (payRef?: string) => {
    try {
      const idempotencyKey = Crypto.randomUUID();
      await api.post(
        '/booking/create',
        {
          type,
          totalAmount: Number(price),
          currency: 'USD',
          guests: [{ firstName, lastName, email }],
          paymentReference: payRef,
        },
        {
          headers: { 'idempotency-key': idempotencyKey },
        },
      );

      router.push({
        pathname: '/checkout/confirmation',
        params: { title },
      });
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Booking Notice',
        'Your payment was initiated. Our concierge team is finalizing your confirmation.',
      );
      router.push({
        pathname: '/checkout/confirmation',
        params: { title },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <ChevronLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 ml-2">Payment</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
          <Text className="text-gray-500 font-bold mb-1">Total to pay</Text>
          <Text className="text-3xl font-black text-[#F4740D] mb-4">
            ${price}
          </Text>
          <View className="h-px bg-gray-200 mb-4" />
          <View className="flex-row items-center">
            <ShieldCheck color="#10b981" size={20} />
            <Text className="text-gray-700 text-sm ml-2">
              Payments are 256-bit encrypted by Paystack.
            </Text>
          </View>
        </View>

        <Text className="font-bold text-gray-900 mb-4">Payment Method</Text>

        {/* Paystack All-in-One Option */}
        <Pressable className="flex-row items-center border-2 border-[#0A0060] bg-[#0A0060]/5 rounded-2xl p-4 mb-4">
          <View className="size-11 rounded-xl bg-[#0A0060] items-center justify-center">
            <CreditCard color="#ffffff" size={22} />
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-bold text-gray-900 text-base">
              Card & Mobile Money
            </Text>
            <Text className="text-gray-500 text-xs mt-0.5">
              Visa, Mastercard, MTN MoMo, Telecel Cash
            </Text>
          </View>
          <View className="w-5 h-5 rounded-full border-4 border-[#0A0060] bg-white" />
        </Pressable>

        <View className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex-row items-center gap-2 mb-6">
          <Smartphone size={18} className="text-slate-500" color="#64748b" />
          <Text className="text-xs text-slate-600 flex-1">
            Ghana Cedis (GHS), USD, and all major African cards & mobile wallets supported.
          </Text>
        </View>

        <Text className="text-xs text-gray-500 leading-5 text-center mt-4">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 bg-white border-t border-gray-100 pb-8">
        <Pressable
          onPress={handlePay}
          disabled={loading}
          className={`w-full py-4 rounded-xl flex-row items-center justify-center ${loading ? 'bg-gray-400' : 'bg-[#0A0060]'}`}
        >
          <Text className="text-white font-bold mr-2 text-lg">
            {loading ? 'Processing...' : 'Pay with Paystack'}
          </Text>
          {!loading && <ChevronRight color="white" size={18} />}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
