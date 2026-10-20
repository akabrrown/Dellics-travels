import { View, Text, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Pressable, TextInput, TouchableWithoutFeedback, Keyboard, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Eye, EyeOff, Check, X, ArrowLeft, ScanFace } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { mode: initialMode } = useLocalSearchParams();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(
    initialMode === 'SIGNUP' ? 'SIGNUP' : 'LOGIN'
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prevent back button on root login screen
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/');
      return true;
    });
    return () => backHandler.remove();
  }, []);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const storedEmail = await SecureStore.getItemAsync('dellics_email');
      const storedPassword = await SecureStore.getItemAsync('dellics_password');
      
      if (hasHardware && isEnrolled && storedEmail && storedPassword) {
        setBiometricsAvailable(true);
      }
    };
    checkBiometrics();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with Biometrics',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        setLoading(true);
        const storedEmail = await SecureStore.getItemAsync('dellics_email');
        const storedPassword = await SecureStore.getItemAsync('dellics_password');
        
        if (storedEmail && storedPassword) {
          const { error } = await supabase.auth.signInWithPassword({ 
            email: storedEmail, 
            password: storedPassword 
          });
          
          if (error) {
            setErrorMessage(error.message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/');
          }
        }
        setLoading(false);
      }
    } catch (e) {
      console.log('Biometric error', e);
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN');
    setErrorMessage('');
  };

  const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
  });

  const signupSchema = z.object({
    firstName: z.string().min(1, 'Please enter your first name.'),
    lastName: z.string().min(1, 'Please enter your last name.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
  });

  async function handleAuth() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Zod Validation
    if (mode === 'LOGIN') {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        setErrorMessage(result.error.issues[0].message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    } else {
      const result = signupSchema.safeParse({ firstName, lastName, email, password });
      if (!result.success) {
        setErrorMessage(result.error.issues[0].message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    }

    setErrorMessage('');
    setLoading(true);

    if (mode === 'LOGIN') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      
      if (error) {
        setErrorMessage(error.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        await SecureStore.setItemAsync('dellics_email', email);
        await SecureStore.setItemAsync('dellics_password', password);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/');
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: '', // Temp disabled
          }
        }
      });
      
      if (!error && data?.user) {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.154.178.28:3000';
        fetch(`${apiUrl}/auth/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.user.id,
            name: `${firstName} ${lastName}`,
            email: email,
            phone: null
          })
        }).catch(err => console.log('Sync failed', err));
      }
      
      setLoading(false);
      
      if (error) {
        setErrorMessage(error.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/auth/setup');
      }
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
            <Pressable 
              onPress={() => router.replace('/')}
              className="p-2 mr-2"
            >
              <ArrowLeft size={24} color="#0A0060" />
            </Pressable>
            <Image 
              source={require('../../assets/app icon.png')} 
              style={{ width: 28, height: 28 }} 
              resizeMode="contain" 
            />
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} keyboardShouldPersistTaps="handled">
            
            <View className="mb-8">
              <Text className="text-3xl font-black text-[#0A0060] leading-tight mb-3">
                {mode === 'LOGIN' ? 'Welcome back' : 'Unlock member pricing'}
              </Text>
              
              {mode === 'SIGNUP' ? (
                <View className="mt-2">
                  <View className="flex-row items-center mb-2">
                    <Check size={16} color="#1E7A34" />
                    <Text className="text-gray-600 font-medium ml-2">Access secret deals up to 30% off</Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Check size={16} color="#1E7A34" />
                    <Text className="text-gray-600 font-medium ml-2">Earn Dellics points on every booking</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Check size={16} color="#1E7A34" />
                    <Text className="text-gray-600 font-medium ml-2">Manage all your trips in one place</Text>
                  </View>
                </View>
              ) : (
                <Text className="text-gray-500 font-medium text-base">
                  Sign in to manage your bookings and access your Dellics points.
                </Text>
              )}
            </View>

            <View className="mb-6">
              
              {mode === 'SIGNUP' && (
                <View className="flex-row justify-between mb-4">
                  <View style={{ width: '48%' }}>
                    <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">First Name</Text>
                    <View className="border border-gray-300 px-4" style={{ height: 48, borderRadius: 4 }}>
                      <TextInput 
                        className="flex-1 text-base text-gray-900 font-medium"
                        placeholder="John"
                        placeholderTextColor="#9CA3AF"
                        value={firstName}
                        onChangeText={setFirstName}
                      />
                    </View>
                  </View>
                  <View style={{ width: '48%' }}>
                    <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Last Name</Text>
                    <View className="border border-gray-300 px-4" style={{ height: 48, borderRadius: 4 }}>
                      <TextInput 
                        className="flex-1 text-base text-gray-900 font-medium"
                        placeholder="Doe"
                        placeholderTextColor="#9CA3AF"
                        value={lastName}
                        onChangeText={setLastName}
                      />
                    </View>
                  </View>
                </View>
              )}

              <View className="mb-4">
                <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email or Phone number</Text>
                <View className="border border-gray-300 px-4" style={{ height: 48, borderRadius: 4 }}>
                  <TextInput 
                    className="flex-1 text-base text-gray-900 font-medium"
                    placeholder="hello@dellicstravels.com or +233..."
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View className="mb-2">
                <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Password</Text>
                <View className="border border-gray-300 px-4 flex-row items-center" style={{ height: 48, borderRadius: 4 }}>
                  <TextInput 
                    className="flex-1 text-base text-gray-900 font-medium"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable 
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowPassword(!showPassword);
                    }} 
                    className="p-2 -mr-2"
                  >
                    {showPassword ? <EyeOff size={20} color="#9CA3AF" /> : <Eye size={20} color="#9CA3AF" />}
                  </Pressable>
                </View>
              </View>

              {mode === 'LOGIN' && (
                <Pressable onPress={() => router.push('/auth/forgot-password')} className="self-end mt-2">
                  <Text className="text-[#F4740D] font-bold text-sm">Forgot password?</Text>
                </Pressable>
              )}

              {errorMessage ? (
                <Text className="text-red-600 mt-2 font-bold text-sm">{errorMessage}</Text>
              ) : null}

              <View className="flex-row items-center mt-6">
                <Pressable 
                  onPress={handleAuth}
                  disabled={loading}
                  className={`flex-1 items-center justify-center ${loading ? 'bg-gray-300' : 'bg-[#F4740D]'}`}
                  style={{ height: 56, borderRadius: 4 }}
                >
                  <Text className="text-white font-black text-lg tracking-widest uppercase">
                    {loading ? 'Please wait...' : mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
                  </Text>
                </Pressable>

                {mode === 'LOGIN' && biometricsAvailable && (
                  <Pressable 
                    onPress={handleBiometricAuth}
                    disabled={loading}
                    className="ml-3 items-center justify-center border border-gray-300 bg-white"
                    style={{ width: 56, height: 56, borderRadius: 4 }}
                  >
                    <ScanFace size={24} color="#0A0060" />
                  </Pressable>
                )}
              </View>
              
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-gray-400 font-bold text-xs uppercase">OR</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              <Pressable className="flex-row items-center justify-center border border-gray-300 bg-white mb-3" style={{ height: 50, borderRadius: 4 }}>
                <Text className="font-bold text-gray-800 ml-3 text-base">Continue with Google</Text>
              </Pressable>

              <Pressable className="flex-row items-center justify-center border border-gray-300 bg-white mb-6" style={{ height: 50, borderRadius: 4 }}>
                <Text className="font-bold text-gray-800 ml-3 text-base">Continue with Apple</Text>
              </Pressable>

            </View>

            <View className="flex-col justify-center items-center mt-auto pb-4">
              <View className="flex-row justify-center items-center mb-6">
                <Text className="text-gray-500 font-medium text-sm">
                  {mode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                </Text>
                <Pressable 
                  onPress={toggleMode} 
                  className="p-2 -m-2"
                >
                  <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest">
                    {mode === 'LOGIN' ? 'Sign Up' : 'Sign In'}
                  </Text>
                </Pressable>
              </View>
              
              {mode === 'LOGIN' && (
                <Pressable onPress={() => router.replace('/')}>
                  <Text className="text-gray-500 font-bold text-sm underline">Continue as Guest</Text>
                </Pressable>
              )}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
