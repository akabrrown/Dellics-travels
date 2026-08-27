import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsSkeleton } from '../../src/components/Skeleton';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Users, CreditCard, Bell, ChevronRight, Shield, Globe, Plane, Utensils, Hotel } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States for toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [priceDrops, setPriceDrops] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoading(false);
    });
  }, []);

  const handleRowPress = (route?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (route) router.push(route as any);
  };

  const SettingsRow = ({ icon: Icon, title, subtitle, showToggle = false, toggleValue = false, onToggle, isLast = false, value, route }: any) => (
    <Pressable 
      onPress={showToggle ? undefined : () => handleRowPress(route)} 
      className={`flex-row items-center justify-between p-4 bg-white ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <View className="flex-row items-center flex-1">
        <Icon size={20} color="#0A0060" className="mr-4" />
        <View className="flex-1 mr-4">
          <Text className="text-sm font-bold text-gray-900">{title}</Text>
          {subtitle && <Text className="text-xs font-semibold text-gray-500 mt-0.5">{subtitle}</Text>}
        </View>
      </View>
      
      {showToggle ? (
        <Switch 
          value={toggleValue} 
          onValueChange={(val) => {
            Haptics.selectionAsync();
            onToggle?.(val);
          }} 
          trackColor={{ false: "#E5E7EB", true: "#0A0060" }}
          thumbColor="#ffffff"
        />
      ) : (
        <View className="flex-row items-center">
          {value && <Text className="text-sm font-bold text-gray-400 mr-2">{value}</Text>}
          <ChevronRight size={18} color="#D1D5DB" />
        </View>
      )}
    </Pressable>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3 mt-8 ml-1">{title}</Text>
  );

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {session && (
          <>
            <SectionHeader title="Account & Security" />
            <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
              <SettingsRow 
                icon={User} 
                title="Personal Information" 
                subtitle="Name, email, and phone number"
                route="/profile/edit"
              />
              <SettingsRow 
                icon={Shield} 
                title="Security & Password" 
                subtitle="Secure your account" 
                isLast
              />
            </View>

            <SectionHeader title="Travel Profiles" />
            <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
              <SettingsRow 
                icon={Users} 
                title="Saved Passengers" 
                subtitle="Add family for fast checkout"
                route="/profile/passport"
              />
              <SettingsRow 
                icon={CreditCard} 
                title="Payment Methods" 
                subtitle="Manage saved cards safely" 
                isLast
                route="/profile/payment-methods"
              />
            </View>
          </>
        )}

        <SectionHeader title="Travel Preferences" />
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          <SettingsRow 
            icon={Plane} 
            title="Seat Preference" 
            value="Aisle"
          />
          <SettingsRow 
            icon={Utensils} 
            title="Meal Preference" 
            value="Standard"
          />
          <SettingsRow 
            icon={Hotel} 
            title="Hotel Amenities" 
            subtitle="Gym, Pool, Spa preferences"
            isLast
          />
        </View>

        <SectionHeader title="Global" />
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          <SettingsRow 
            icon={Globe} 
            title="Language" 
            value="English (UK)"
            route="/profile/language"
          />
          <SettingsRow 
            icon={CreditCard} 
            title="Display Currency" 
            value="GHS (₵)"
            isLast
            route="/profile/language"
          />
        </View>

        <SectionHeader title="Notifications" />
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          <SettingsRow 
            icon={Bell} 
            title="Flight Updates" 
            subtitle="Delays and gate changes" 
            showToggle
            toggleValue={pushEnabled}
            onToggle={setPushEnabled}
          />
          <SettingsRow 
            icon={Bell} 
            title="Price Drops" 
            subtitle="Alerts for saved routes" 
            showToggle
            toggleValue={priceDrops}
            onToggle={setPriceDrops}
            isLast
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

