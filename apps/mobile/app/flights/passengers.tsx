import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Calendar, CreditCard, AlertCircle, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../src/lib/supabase';
import { useBookingStore } from '../../src/store/useBookingStore';

export default function PassengerDetailsScreen() {
  const router = useRouter();
  const { flightId, fare, seat } = useLocalSearchParams<{ flightId: string; fare: string; seat?: string }>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [passport, setPassport] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Attempt auto-fill from user profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata) {
        const meta = session.user.user_metadata;
        if (meta.full_name) {
          const parts = meta.full_name.split(' ');
          if (parts[0]) setFirstName(parts[0]);
          if (parts.slice(1).join(' ')) setLastName(parts.slice(1).join(' '));
        }
      }
    });
  }, []);

  const handleAutofill = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.user_metadata) {
      const meta = session.user.user_metadata;
      if (meta.full_name) {
        const parts = meta.full_name.split(' ');
        setFirstName(parts[0] || 'Kofi');
        setLastName(parts.slice(1).join(' ') || 'Mensah');
      } else {
        setFirstName('Kofi');
        setLastName('Mensah');
      }
      setDob('05/14/1992');
      setPassport('G12345678');
    } else {
      setFirstName('Kofi');
      setLastName('Mensah');
      setDob('05/14/1992');
      setPassport('G12345678');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Basic DOB validation
    const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
    if (!dob.trim()) {
      newErrors.dob = 'Date of birth is required';
    } else if (!dobRegex.test(dob)) {
      newErrors.dob = 'Format must be MM/DD/YYYY';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setPassenger = useBookingStore((state) => state.setPassenger);

  const handleContinue = () => {
    if (isSubmitting) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (validateForm()) {
      setIsSubmitting(true);
      // Store passenger PII securely in memory (Zustand) instead of exposing in URL parameters
      setPassenger({
        firstName,
        lastName,
        dob,
        passport: passport || undefined,
      });

      router.push(`/checkout/${flightId || '1'}?type=FLIGHT&fare=${fare || 'economy'}&seat=${seat || ''}`);
      setTimeout(() => setIsSubmitting(false), 1000);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView edges={['top']} className="bg-[#0A0060]" />
      
      {/* Header */}
      <View className="bg-[#0A0060] px-4 py-4 pb-8 flex-row items-center border-b border-[#0A0060]">
        <Pressable 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
          className="p-2 mr-2 -ml-2"
        >
          <ChevronLeft size={24} color="#FFF" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-black text-white">Passenger Details</Text>
          <Text className="text-sm font-semibold text-blue-200">
            Adult 1 · {fare ? fare.charAt(0).toUpperCase() + fare.slice(1) : 'Economy'}{seat ? ` · Seat ${seat}` : ''}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
          
          <View className="bg-white rounded-[16px] p-5 mt-[-20px] mb-6 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-black text-gray-900">Primary Passenger</Text>
              
              <Pressable
                onPress={handleAutofill}
                className="flex-row items-center bg-[#F4740D]/10 px-3 py-1.5 rounded-full"
              >
                <Sparkles size={14} color="#F4740D" />
                <Text className="text-[#F4740D] font-bold text-xs ml-1.5">Autofill Profile</Text>
              </Pressable>
            </View>
            
            {/* First Name */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">First Name (As on Passport)</Text>
              <View className={`flex-row items-center bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-[8px] px-4 h-14`}>
                <User color={errors.firstName ? "#DC2626" : "#6B7280"} size={20} className="mr-3" />
                <TextInput
                  value={firstName}
                  onChangeText={(text) => { setFirstName(text); setErrors(prev => ({ ...prev, firstName: '' })); }}
                  placeholder="e.g. Jane"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-base font-semibold text-gray-900"
                />
              </View>
              {errors.firstName && (
                <View className="flex-row items-center mt-1.5 ml-1">
                  <AlertCircle size={12} color="#DC2626" />
                  <Text className="text-red-500 text-xs font-semibold ml-1">{errors.firstName}</Text>
                </View>
              )}
            </View>

            {/* Last Name */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Last Name</Text>
              <View className={`flex-row items-center bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-[8px] px-4 h-14`}>
                <User color={errors.lastName ? "#DC2626" : "#6B7280"} size={20} className="mr-3" />
                <TextInput
                  value={lastName}
                  onChangeText={(text) => { setLastName(text); setErrors(prev => ({ ...prev, lastName: '' })); }}
                  placeholder="e.g. Doe"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 text-base font-semibold text-gray-900"
                />
              </View>
              {errors.lastName && (
                <View className="flex-row items-center mt-1.5 ml-1">
                  <AlertCircle size={12} color="#DC2626" />
                  <Text className="text-red-500 text-xs font-semibold ml-1">{errors.lastName}</Text>
                </View>
              )}
            </View>

            {/* DOB */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Date of Birth</Text>
              <View className={`flex-row items-center bg-gray-50 border ${errors.dob ? 'border-red-500' : 'border-gray-200'} rounded-[8px] px-4 h-14`}>
                <Calendar color={errors.dob ? "#DC2626" : "#6B7280"} size={20} className="mr-3" />
                <TextInput
                  value={dob}
                  onChangeText={(text) => { setDob(text); setErrors(prev => ({ ...prev, dob: '' })); }}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  className="flex-1 text-base font-semibold text-gray-900"
                />
              </View>
              {errors.dob && (
                <View className="flex-row items-center mt-1.5 ml-1">
                  <AlertCircle size={12} color="#DC2626" />
                  <Text className="text-red-500 text-xs font-semibold ml-1">{errors.dob}</Text>
                </View>
              )}
            </View>

            {/* Passport */}
            <View>
              <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Passport Number (Optional)</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-[8px] px-4 h-14">
                <CreditCard color="#6B7280" size={20} className="mr-3" />
                <TextInput
                  value={passport}
                  onChangeText={setPassport}
                  placeholder="For international flights"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  className="flex-1 text-base font-semibold text-gray-900"
                />
              </View>
            </View>

          </View>
          
          <Text className="text-xs text-gray-500 text-center px-4 leading-relaxed">
            By continuing, you agree that your name matches your government-issued ID or passport exactly.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pt-4 pb-8 shadow-lg">
        <Pressable 
          onPress={handleContinue}
          disabled={isSubmitting}
          className={`h-14 w-full items-center justify-center rounded-[8px] ${isSubmitting ? 'bg-gray-400' : 'bg-[#0A0060]'}`}
        >
          <Text className="text-white font-black text-sm uppercase tracking-widest">
            {isSubmitting ? 'Processing...' : 'Continue to Checkout'}
          </Text>
        </Pressable>
      </View>

    </View>
  );
}
