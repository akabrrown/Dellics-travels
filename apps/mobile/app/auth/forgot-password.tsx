import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleResetPassword() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!email) {
      setErrorMessage('Please enter your email address.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    setLoading(false);
    
    if (error) {
      setErrorMessage(error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccessMessage('A password reset link has been sent to your email.');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-4 py-4 flex-row items-center border-b border-gray-100">
            <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="p-2 mr-2">
              <ArrowLeft size={24} color="#0A0060" />
            </Pressable>
            <Text className="text-lg font-black text-[#0A0060]">Reset Password</Text>
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} keyboardShouldPersistTaps="handled">
            
            <View className="mb-8">
              <Text className="text-3xl font-black text-[#0A0060] leading-tight mb-3">
                Forgot password?
              </Text>
              <Text className="text-gray-500 font-medium text-base">
                Enter the email address or phone number associated with your account and we'll send you a link to reset your password.
              </Text>
            </View>

            <View className="mb-6">
              <View className="mb-4">
                <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email or Phone number</Text>
                <View className="border border-gray-300 px-4" style={{ height: 48, borderRadius: 4 }}>
                  <TextInput 
                    className="flex-1 text-base text-gray-900 font-medium"
                    placeholder="hello@dellicstravels.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {errorMessage ? (
                <Text className="text-red-600 mt-2 font-bold text-sm">{errorMessage}</Text>
              ) : null}

              {successMessage ? (
                <View className="bg-green-50 p-4 rounded mt-2 border border-green-200">
                  <Text className="text-green-700 font-medium text-sm">{successMessage}</Text>
                </View>
              ) : null}

              <Pressable 
                onPress={handleResetPassword}
                disabled={loading || !!successMessage}
                className={`mt-6 items-center justify-center ${loading || successMessage ? 'bg-gray-300' : 'bg-[#F4740D]'}`}
                style={{ height: 56, borderRadius: 4 }}
              >
                <Text className="text-white font-black text-lg tracking-widest uppercase">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </Pressable>
            </View>

            <View className="flex-row justify-center items-center mt-auto pb-4">
              <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="p-2">
                <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest">
                  Back to Log In
                </Text>
              </Pressable>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
