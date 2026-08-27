import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function GuestDetailsScreen() {
  const router = useRouter();
  const { type, price, title } = useLocalSearchParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (validate()) {
      router.push({
        pathname: '/checkout/payment',
        params: { type, price, title, firstName, lastName, email }
      });
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ChevronLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 ml-2">Guest Details</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-[#0A0060]/10 items-center justify-center mr-3">
            <User color="#0A0060" size={20} />
          </View>
          <View>
            <Text className="text-gray-900 font-bold text-lg">Primary Traveler</Text>
            <Text className="text-gray-500 text-sm">Please enter details exactly as on ID.</Text>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-sm font-bold text-gray-700 mb-2">First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={(text) => { setFirstName(text); setErrors(e => ({...e, firstName: ''})) }}
            placeholder="e.g. John"
            className={`border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 h-14 bg-gray-50 text-base`}
          />
          {errors.firstName && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</Text>}
        </View>

        <View className="mb-5">
          <Text className="text-sm font-bold text-gray-700 mb-2">Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={(text) => { setLastName(text); setErrors(e => ({...e, lastName: ''})) }}
            placeholder="e.g. Doe"
            className={`border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 h-14 bg-gray-50 text-base`}
          />
          {errors.lastName && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</Text>}
        </View>

        <View className="mb-5">
          <Text className="text-sm font-bold text-gray-700 mb-2">Email Address</Text>
          <TextInput
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors(e => ({...e, email: ''})) }}
            placeholder="For booking confirmation"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 h-14 bg-gray-50 text-base`}
          />
          {errors.email && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text>}
        </View>

        <View className="mb-8">
          <Text className="text-sm font-bold text-gray-700 mb-2">Phone Number (Optional)</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +1 234 567 8900"
            keyboardType="phone-pad"
            className="border border-gray-300 rounded-xl px-4 h-14 bg-gray-50 text-base"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 bg-white border-t border-gray-100 pb-8">
        <Pressable 
          onPress={handleContinue}
          className="bg-[#0A0060] w-full py-4 rounded-xl flex-row items-center justify-center"
        >
          <Text className="text-white font-bold mr-2 text-lg">Continue to Payment</Text>
          <ChevronRight color="white" size={18} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
