import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react-native';
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
      // 1. Create payment intent on the backend
      const intentResponse = await api.post('/booking/payment-intent', {
        amount: Number(price),
        currency: 'usd',
        metadata: {
          type,
          title,
          guestName: `${firstName} ${lastName}`,
          guestEmail: email
        }
      });

      const { clientSecret } = intentResponse.data;

      if (!clientSecret) {
        Alert.alert('Error', 'Could not initialize payment. Please try again.');
        setLoading(false);
        return;
      }

      // 2. Attempt to use Stripe PaymentSheet if available
      let stripeAvailable = false;
      try {
        const { useStripe } = require('@stripe/stripe-react-native');
        const { initPaymentSheet, presentPaymentSheet } = useStripe();

        const { error: initError } = await initPaymentSheet({
          merchantDisplayName: 'Dellics Travels',
          paymentIntentClientSecret: clientSecret,
          defaultBillingDetails: {
            name: `${firstName} ${lastName}`,
            email: email as string,
          }
        });

        if (initError) {
          Alert.alert('Error', initError.message);
          setLoading(false);
          return;
        }

        const { error: paymentError } = await presentPaymentSheet();
        if (paymentError) {
          Alert.alert('Payment failed', paymentError.message);
          setLoading(false);
          return;
        }

        stripeAvailable = true;
      } catch {
        // Stripe native module not available (Expo Go), skip to booking
        stripeAvailable = false;
      }

      // 3. Create the booking record
      await createBooking();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unable to process payment. Please try again.';
      Alert.alert('Payment Error', message);
      setLoading(false);
    }
  };

  const createBooking = async () => {
    try {
      const idempotencyKey = Crypto.randomUUID();
      await api.post('/booking/create', {
        type,
        totalAmount: Number(price),
        currency: 'USD',
        guests: [{ firstName, lastName, email }]
      }, {
        headers: { 'idempotency-key': idempotencyKey }
      });

      router.push({
        pathname: '/checkout/confirmation',
        params: { title }
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Booking Error', 'Payment succeeded but failed to save booking. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ChevronLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 ml-2">Payment</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
          <Text className="text-gray-500 font-bold mb-1">Total to pay</Text>
          <Text className="text-3xl font-black text-[#F4740D] mb-4">${price}</Text>
          <View className="h-px bg-gray-200 mb-4" />
          <View className="flex-row items-center">
            <ShieldCheck color="#10b981" size={20} />
            <Text className="text-gray-700 text-sm ml-2">Payments are secure and encrypted.</Text>
          </View>
        </View>

        <Text className="font-bold text-gray-900 mb-4">Payment Method</Text>
        <Pressable className="flex-row items-center border border-[#0A0060] bg-[#0A0060]/5 rounded-xl p-4 mb-4">
          <CreditCard color="#0A0060" size={24} />
          <View className="flex-1 ml-4">
            <Text className="font-bold text-gray-900 text-base">Credit or Debit Card</Text>
            <Text className="text-gray-500 text-sm mt-0.5">Powered by Stripe</Text>
          </View>
          <View className="w-5 h-5 rounded-full border-4 border-[#0A0060] bg-white" />
        </Pressable>

        <Text className="text-xs text-gray-500 leading-5 text-center mt-6">
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
            {loading ? 'Processing...' : 'Pay & Book Now'}
          </Text>
          {!loading && <ChevronRight color="white" size={18} />}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
