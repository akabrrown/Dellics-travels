import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { Skeleton } from '../../src/components/Skeleton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, User, Tag, Check, CreditCard } from 'lucide-react-native';
import { AnimatedButton } from '../../src/components/AnimatedButton';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../../src/lib/api';
import { useBookingStore } from '../../src/store/useBookingStore';
import * as Haptics from 'expo-haptics';

export default function CheckoutScreen() {
  const router = useRouter();
  const { id, fare, type } = useLocalSearchParams<{ id: string; fare?: string; type?: string }>();
  const passenger = useBookingStore((state) => state.passenger);
  
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);

  const baseAmount = fare === 'business' ? 1250 : fare === 'premium' ? 850 : 550; 
  const finalAmount = Math.max(0, baseAmount - appliedDiscount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'DELLICS10' || code === 'WELCOME50') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAppliedDiscount(50);
      setAppliedCode(code);
      setShowPromoModal(false);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Invalid Code', 'Please enter a valid promo code like WELCOME50');
    }
  };

  const handlePay = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const response = await api.post('/payments/initialize', {
        amount: finalAmount,
        currency: 'USD',
        bookingId: id,
        email: passenger?.email || 'traveler@dellicstravels.com',
      });

      const { authorizationUrl, reference: txRef } = response.data;

      if (authorizationUrl) {
        setAuthUrl(authorizationUrl);
        setReference(txRef);
        
        const result = await WebBrowser.openAuthSessionAsync(
          authorizationUrl,
          'dellics://checkout/success'
        );

        if (result.type === 'success' || result.type === 'dismiss') {
          // Verify transaction
          if (txRef) {
            await api.get(`/payments/verify/${txRef}`).catch(() => null);
          }
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.push(`/checkout/success?bookingId=${id}`);
        }
      } else {
        Alert.alert('Error', 'Unable to start payment session. Please try again.');
      }
    } catch (error: any) {
      console.error('Paystack error:', error);
      Alert.alert('Payment Error', error?.response?.data?.message || 'Unable to process payment.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-primary rounded-b-[40px] z-10">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="mr-4 p-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <ChevronLeft size={24} color="#FFF" />
          </Pressable>
          <View>
            <Text className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Secure Checkout</Text>
            <Text className="text-2xl font-bold text-white">Complete Booking</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Passenger Summary Card */}
        {passenger && (
          <View className="bg-white p-5 rounded-3xl mb-4 border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-[#0A0060]/10 items-center justify-center mr-2">
                <User size={16} color="#0A0060" />
              </View>
              <Text className="text-base font-bold text-gray-900">Primary Traveler</Text>
            </View>
            <Text className="text-lg font-black text-[#0A0060]">{passenger.firstName} {passenger.lastName}</Text>
            {passenger.dob ? <Text className="text-xs text-gray-500 mt-0.5">DOB: {passenger.dob}</Text> : null}
            {passenger.passport ? <Text className="text-xs text-gray-500 mt-0.5">Passport: {passenger.passport}</Text> : null}
          </View>
        )}

        {/* Order Summary Card */}
        <View className="bg-white p-5 rounded-3xl mb-4 border border-gray-100 shadow-sm">
          <View className="flex-row items-center mb-4">
            <ShieldCheck size={20} color="#0A0060" />
            <Text className="text-lg font-bold text-primary ml-2">Order Summary</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-medium">Reservation ({type || 'Flight'} #{id})</Text>
            <Text className="text-gray-900 font-bold">${(baseAmount - 50).toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-medium">Taxes & Mandatory Fees</Text>
            <Text className="text-gray-900 font-bold">$50.00</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600 font-medium">Fare Class</Text>
            <Text className="font-bold text-[#0A0060]">{fare ? fare.charAt(0).toUpperCase() + fare.slice(1) : 'Standard Economy'}</Text>
          </View>

          {appliedDiscount > 0 ? (
            <View className="flex-row justify-between mb-3 bg-green-50 p-3 rounded-xl border border-green-200">
              <Text className="text-green-800 font-bold">Promo Discount ({appliedCode})</Text>
              <Text className="text-green-800 font-black">-${appliedDiscount}.00</Text>
            </View>
          ) : null}

          <View className="h-px w-full bg-gray-100 mb-4" />
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-black text-primary">Total Amount</Text>
            <Text className="text-3xl font-black text-[#F4740D]">${finalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* S26 Promo Code Trigger */}
        <Pressable 
          onPress={() => setShowPromoModal(!showPromoModal)}
          className="bg-white p-4 rounded-2xl mb-6 border border-gray-200 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Tag size={18} color="#F4740D" className="mr-2" />
            <Text className="font-bold text-gray-800 text-sm ml-2">Have a promo code?</Text>
          </View>
          <Text className="text-[#F4740D] font-bold text-xs uppercase tracking-wider">{appliedCode ? 'Applied ✓' : 'Enter Code'}</Text>
        </Pressable>

        {/* Promo Modal Inline Drawer */}
        {showPromoModal ? (
          <View className="bg-orange-50 border border-orange-200 p-4 rounded-2xl mb-6">
            <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Enter Coupon / Promo Code</Text>
            <View className="flex-row">
              <TextInput 
                value={promoInput}
                onChangeText={setPromoInput}
                placeholder="e.g. WELCOME50"
                placeholderTextColor="#9CA3AF"
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-900 mr-2"
                autoCapitalize="characters"
              />
              <Pressable 
                onPress={handleApplyPromo}
                className="bg-[#F4740D] px-4 justify-center rounded-lg"
              >
                <Text className="text-white font-bold text-xs uppercase">Apply</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <AnimatedButton 
          title={loading ? "Processing..." : `Pay $${finalAmount.toFixed(2)} with Paystack`} 
          onPress={handlePay} 
          loading={loading}
          variant="secondary"
        />
        
        <Text className="text-center text-xs text-gray-400 mt-4 px-4 leading-relaxed">
          By clicking Pay, you agree to our Terms of Service. Your payment is securely encrypted by Paystack (Cards & Mobile Money).
        </Text>

      </ScrollView>
    </View>
  );
}
