import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  KeyboardAvoidingView, Platform, Switch, TouchableWithoutFeedback, Keyboard, BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import {
  MapPin, Globe, Bell, ChevronDown, Check, Plane,
} from 'lucide-react-native';



export default function ProfileSetupScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Prevent back button on root setup screen
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/');
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [homeAirport, setHomeAirport] = useState('');
  const [homeAirportCity, setHomeAirportCity] = useState('');
  const [airportQuery, setAirportQuery] = useState('');
  const [showAirportPicker, setShowAirportPicker] = useState(false);
  const [airports, setAirports] = useState<{code: string, name: string, city: string}[]>([]);
  const [isSearchingAirports, setIsSearchingAirports] = useState(false);
  const [currency, setCurrency] = useState('GHS');
  const [currencies, setCurrencies] = useState<{name: string, currency: string}[]>([]);
  const [currencyQuery, setCurrencyQuery] = useState('');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!airportQuery.trim()) {
      setAirports([]);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearchingAirports(true);
      fetch(`https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(airportQuery)}&locale=en&types[]=airport&types[]=city`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data)) {
            const mapped = data.map((item: any) => ({
              code: item.code,
              name: item.type === 'city' ? item.main_airport_name || 'All Airports' : item.name,
              city: item.city_name || item.name,
            }));
            setAirports(mapped);
          } else {
            setAirports([]);
          }
        })
        .catch(err => console.log('Failed to fetch airports', err))
        .finally(() => setIsSearchingAirports(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [airportQuery]);

  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/currency')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          // data.data is an array of { name: 'Ghana', currency: 'GHS', iso2: 'GH', iso3: 'GHA' }
          // Filter out entries without a valid currency
          const valid = data.data.filter((c: any) => c.currency && c.name);
          setCurrencies(valid);
        }
      })
      .catch(err => console.log('Failed to fetch currencies', err));
  }, []);

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setErrorMessage('');

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/auth/login');
      return;
    }

    setSaving(true);

    // Build metadata update — only include non-empty values
    const metadataUpdate: Record<string, any> = {
      preferred_currency: currency,
      notifications_enabled: notificationsEnabled,
      profile_setup_complete: true,
    };
    if (fullName.trim()) metadataUpdate.full_name = fullName.trim();
    if (phone.trim()) metadataUpdate.phone = phone.trim();
    if (homeAirport) metadataUpdate.home_airport = homeAirport;

    const { error } = await supabase.auth.updateUser({ data: metadataUpdate });

    // Also update name in the backend User record if provided
    if (fullName.trim() && !error) {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.154.178.28:3000';
      fetch(`${apiUrl}/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: session.user.id,
          name: fullName.trim(),
          email: session.user.email,
          phone: phone.trim() || null,
        }),
      }).catch(e => console.log('Profile sync error', e));
    }

    setSaving(false);

    if (error) {
      setErrorMessage(error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mb-8">
              <View className="w-12 h-12 bg-[#0A0060] items-center justify-center mb-6" style={{ borderRadius: 6 }}>
                <Plane size={22} color="white" />
              </View>
              <Text className="text-3xl font-black text-[#0A0060] leading-tight mb-2">
                Set up your profile
              </Text>
              <Text className="text-gray-500 text-base font-medium leading-relaxed">
                Help us personalise your travel experience. You can always update these later.
              </Text>
            </View>

            {/* Full Name */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Full Name
              </Text>
              <View className="border border-gray-300 px-4" style={{ height: 48, borderRadius: 4, justifyContent: 'center' }}>
                <TextInput
                  className="text-base text-gray-900 font-medium"
                  placeholder="Kwame Mensah"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Phone Number
              </Text>
              <View className="border border-gray-300 px-4" style={{ height: 48, borderRadius: 4, justifyContent: 'center' }}>
                <TextInput
                  className="text-base text-gray-900 font-medium"
                  placeholder="+233 55 000 0000"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Home Airport */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Home Airport
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAirportPicker(!showAirportPicker);
                  setShowCurrencyPicker(false);
                }}
                className="border border-gray-300 px-4 flex-row items-center justify-between"
                style={{ height: 48, borderRadius: 4 }}
              >
                <View className="flex-row items-center flex-1">
                  <MapPin size={16} color="#9CA3AF" />
                  <Text className={`ml-3 text-base font-medium ${homeAirport ? 'text-gray-900' : 'text-gray-400'}`}>
                    {homeAirport
                      ? (homeAirportCity ? `${homeAirport} — ${homeAirportCity}` : homeAirport)
                      : 'Select airport'}
                  </Text>
                </View>
                <ChevronDown size={16} color="#9CA3AF" />
              </Pressable>

              {showAirportPicker && (
                <View className="border border-gray-200 bg-white mt-1" style={{ borderRadius: 4, overflow: 'hidden', maxHeight: 300 }}>
                  <View className="border-b border-gray-100 px-3 py-2">
                    <TextInput
                      className="text-sm text-gray-900"
                      placeholder="Search airports or cities..."
                      placeholderTextColor="#9CA3AF"
                      value={airportQuery}
                      onChangeText={setAirportQuery}
                      autoFocus
                    />
                  </View>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {isSearchingAirports ? (
                      <View className="p-4 items-center justify-center">
                        <Text className="text-sm text-gray-500">Searching...</Text>
                      </View>
                    ) : airports.length === 0 ? (
                      <View className="p-4 items-center justify-center">
                        <Text className="text-sm text-gray-500">
                          {!airportQuery.trim() ? "Type to search airports & cities..." : "No airports found."}
                        </Text>
                      </View>
                    ) : (
                      airports.map(airport => (
                        <Pressable
                          key={airport.code}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setHomeAirport(airport.code);
                            setHomeAirportCity(airport.city);
                            setAirportQuery('');
                            setShowAirportPicker(false);
                          }}
                          className="px-4 py-3 flex-row items-center border-b border-gray-50"
                        >
                          <View className="mr-3">
                            <Text className="text-sm font-black text-[#0A0060]">{airport.code}</Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-bold text-gray-800">{airport.city}</Text>
                            <Text className="text-xs text-gray-400">{airport.name}</Text>
                          </View>
                          {homeAirport === airport.code && <Check size={16} color="#F4740D" />}
                        </Pressable>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Preferred Currency */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">
                Preferred Currency
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowCurrencyPicker(!showCurrencyPicker);
                  setShowAirportPicker(false);
                }}
                className="border border-gray-300 px-4 flex-row items-center justify-between"
                style={{ height: 48, borderRadius: 4 }}
              >
                <View className="flex-row items-center">
                  <Globe size={16} color="#9CA3AF" />
                  <Text className="ml-3 text-base font-medium text-gray-900">{currency}</Text>
                </View>
                <ChevronDown size={16} color="#9CA3AF" />
              </Pressable>

              {showCurrencyPicker && (
                <View className="border border-gray-200 bg-white mt-1" style={{ borderRadius: 4, overflow: 'hidden', maxHeight: 250 }}>
                  <View className="border-b border-gray-100 px-3 py-2">
                    <TextInput
                      className="text-sm text-gray-900"
                      placeholder="Search country or currency..."
                      placeholderTextColor="#9CA3AF"
                      value={currencyQuery}
                      onChangeText={setCurrencyQuery}
                      autoFocus
                    />
                  </View>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {currencies
                      .filter(c => 
                        c.name.toLowerCase().includes(currencyQuery.toLowerCase()) || 
                        c.currency.toLowerCase().includes(currencyQuery.toLowerCase())
                      )
                      .map((c, index) => (
                      <Pressable
                        key={`${c.currency}-${index}`}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setCurrency(c.currency);
                          setShowCurrencyPicker(false);
                          setCurrencyQuery('');
                        }}
                        className="px-4 py-3 flex-row items-center justify-between border-b border-gray-50"
                      >
                        <View>
                          <Text className="text-sm font-bold text-gray-800">{c.name}</Text>
                          <Text className="text-xs text-gray-400">{c.currency}</Text>
                        </View>
                        {currency === c.currency && <Check size={16} color="#F4740D" />}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Notification Opt-in */}
            <View className="mb-8 border border-gray-200 px-4 py-4" style={{ borderRadius: 4 }}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 mr-4">
                  <Bell size={18} color="#0A0060" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-bold text-gray-800">Trip & price notifications</Text>
                    <Text className="text-xs text-gray-400 mt-0.5">
                      Get alerts for price drops, check-in reminders, and booking updates.
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={v => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setNotificationsEnabled(v);
                  }}
                  trackColor={{ false: '#E5E7EB', true: '#0A0060' }}
                  thumbColor="white"
                />
              </View>
            </View>

            {errorMessage ? (
              <Text className="text-red-600 text-sm font-bold mb-4">{errorMessage}</Text>
            ) : null}

            {/* CTA */}
            <Pressable
              onPress={handleContinue}
              disabled={saving}
              className={`items-center justify-center ${saving ? 'bg-gray-300' : 'bg-[#F4740D]'}`}
              style={{ height: 56, borderRadius: 4 }}
            >
              <Text className="text-white font-black text-lg tracking-widest uppercase">
                {saving ? 'Saving...' : 'Continue'}
              </Text>
            </Pressable>

            <Pressable onPress={handleSkip} className="items-center mt-5 py-2">
              <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest">
                Skip for now
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
