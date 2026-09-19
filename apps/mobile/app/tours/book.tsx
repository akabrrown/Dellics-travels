import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../src/lib/api';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';

export default function TourBookScreen() {
  const { id, title, price } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(false);
  const [paxCount, setPaxCount] = useState('1');
  const [departureDate, setDepartureDate] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  const totalAmount = parseInt(paxCount || '1') * parseFloat(price || '0');

  const handlePay = async () => {
    if (!departureDate || !leadName || !leadEmail) {
      Alert.alert('Missing Info', 'Please fill all required fields');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const response = await api.post('/tours/book', {
        tourId: id,
        paxCount: parseInt(paxCount),
        departureDate,
        leadName,
        leadEmail,
        leadPhone,
        amount: totalAmount
      });

      const { authorizationUrl } = response.data;
      if (authorizationUrl) {
        const result = await WebBrowser.openAuthSessionAsync(
          authorizationUrl,
          'dellics://checkout/success'
        );

        if (result.type === 'success' || result.type === 'dismiss') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('Booking Successful', 'Your tour has been booked successfully!', [
            { text: 'View My Trips', onPress: () => router.replace('/(tabs)/trips') }
          ]);
        }
      }
    } catch (e) {
      console.log('Payment error', e);
      Alert.alert('Payment Error', 'Could not initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full border border-gray-200">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Book Tour</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 150 }}>
        <View className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <Text className="text-sm text-gray-500 font-bold uppercase mb-1">Selected Tour</Text>
          <Text className="text-lg font-black text-gray-900">{title}</Text>
        </View>

        <Text className="text-sm font-bold text-gray-900 mb-2 ml-1">Departure Date</Text>
        <TextInput 
          placeholder="YYYY-MM-DD"
          value={departureDate}
          onChangeText={setDepartureDate}
          className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-5 text-base"
        />

        <Text className="text-sm font-bold text-gray-900 mb-2 ml-1">Number of Travelers</Text>
        <TextInput 
          placeholder="1"
          keyboardType="number-pad"
          value={paxCount}
          onChangeText={setPaxCount}
          className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-5 text-base"
        />

        <Text className="text-lg font-bold text-gray-900 mb-4 mt-2">Lead Passenger</Text>
        
        <Text className="text-sm font-bold text-gray-900 mb-2 ml-1">Full Name</Text>
        <TextInput 
          placeholder="Jane Doe"
          value={leadName}
          onChangeText={setLeadName}
          className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-4 text-base"
        />

        <Text className="text-sm font-bold text-gray-900 mb-2 ml-1">Email</Text>
        <TextInput 
          placeholder="jane@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={leadEmail}
          onChangeText={setLeadEmail}
          className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-4 text-base"
        />

        <Text className="text-sm font-bold text-gray-900 mb-2 ml-1">Phone Number</Text>
        <TextInput 
          placeholder="+1234567890"
          keyboardType="phone-pad"
          value={leadPhone}
          onChangeText={setLeadPhone}
          className="bg-white border border-gray-300 rounded-xl px-4 py-4 mb-4 text-base"
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 flex-row justify-between items-center" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <View>
          <Text className="text-xs text-gray-500 font-bold uppercase">Total Amount</Text>
          <Text className="text-2xl font-black text-[#0A0060]">${totalAmount.toFixed(2)}</Text>
        </View>
        <Pressable 
          onPress={handlePay}
          disabled={loading}
          className="bg-[#0A0060] px-8 py-4 rounded-xl flex-row items-center"
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Pay Now</Text>}
        </Pressable>
      </View>
    </View>
  );
}
