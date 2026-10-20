import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileSkeleton } from '../../src/components/Skeleton';
import { useRouter } from 'expo-router';
import { Settings, LogOut, ChevronRight, User, CreditCard, Heart, Shield, Crown, BadgePercent, CheckCircle2, Smartphone, Briefcase, Bell } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';

function GuestProfileView({ onLogin }: { onLogin: () => void }) {
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-[#F9FAFB] border border-gray-200 items-center justify-center mb-6" style={{ borderRadius: 8 }}>
          <User size={32} color="#0A0060" />
        </View>
        <Text className="text-2xl font-black text-[#0A0060] text-center mb-3">
          Join Dellics Rewards
        </Text>
        <Text className="text-gray-500 text-center text-sm mb-8 leading-relaxed">
          Create an account to start earning points and unlock a frictionless booking experience.
        </Text>
      </View>

      <View className="mb-10">
        <View className="flex-row items-start mb-6">
          <Crown size={20} color="#F4740D" className="mt-0.5 mr-4" />
          <View className="flex-1">
            <Text className="text-[#0A0060] font-bold mb-1 text-base">Earn Points on Every Trip</Text>
            <Text className="text-gray-500 text-sm">Earn 1 point for every GHS spent, redeemable on flights, hotels, and packages.</Text>
          </View>
        </View>
        <View className="flex-row items-start mb-6">
          <CreditCard size={20} color="#F4740D" className="mt-0.5 mr-4" />
          <View className="flex-1">
            <Text className="text-[#0A0060] font-bold mb-1 text-base">1-Tap Checkout</Text>
            <Text className="text-gray-500 text-sm">Securely save your payment methods to book your next trip in seconds.</Text>
          </View>
        </View>
        <View className="flex-row items-start">
          <Shield size={20} color="#F4740D" className="mt-0.5 mr-4" />
          <View className="flex-1">
            <Text className="text-[#0A0060] font-bold mb-1 text-base">Saved Travelers</Text>
            <Text className="text-gray-500 text-sm">Store passport and ID details for you and your family for faster group bookings.</Text>
          </View>
        </View>
      </View>

      <Pressable 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onLogin();
        }}
        className="bg-[#0A0060] items-center justify-center w-full"
        style={{ height: 56, borderRadius: 4 }}
      >
        <Text className="text-white font-black text-sm tracking-widest uppercase">Sign In or Register</Text>
      </Pressable>
    </View>
  );
}

function MemberProfileView({ user, onLogout }: { user: any, onLogout: () => void }) {
  const router = useRouter();

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/profile/settings');
  };

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Dellics Voyager', 'Upgrade flow opens via Paystack Subscriptions.');
  };


  const firstName = user?.user_metadata?.first_name || 'Traveler';
  const lastName = user?.user_metadata?.last_name || '';
  const initial = firstName.charAt(0).toUpperCase() || 'D';

  const QUICK_ACCESS_ITEMS = [
    { id: 'trips', title: 'Saved Trips', icon: Briefcase, route: '/(tabs)/trips' },
    { id: 'payment', title: 'Payment Methods', icon: CreditCard, route: '/profile/payment-methods' },
    { id: 'esims', title: 'My eSIMs', icon: Smartphone, route: '/esim/dashboard' },
    { id: 'alerts', title: 'Price Alerts', icon: Bell, route: '/notifications' },
  ];

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-200 bg-white">
        <Text className="text-xl font-black text-[#0A0060]">Profile</Text>
        <Pressable onPress={handleSettings} className="p-2 -mr-2">
          <Settings size={22} color="#0A0060" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Block */}
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/profile/edit'); }} className="flex-row items-center mb-8">
          <View className="w-16 h-16 bg-[#0A0060] items-center justify-center mr-4" style={{ borderRadius: 8 }}>
            <Text className="text-white text-2xl font-black">{initial}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-black text-gray-900 leading-tight">
              {firstName} {lastName}
            </Text>
            <Text className="text-gray-500 font-semibold text-sm">{user?.email}</Text>
          </View>
          <ChevronRight size={18} color="#D1D5DB" />
        </Pressable>

        {/* Dellics Rewards Section */}
        <Text className="text-lg font-black text-[#0A0060] mb-4">Dellics Rewards</Text>
        
        <View className="bg-white border border-gray-200 mb-8" style={{ borderRadius: 8 }}>
          
          <View className="p-5 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Current Tier</Text>
              <View className="flex-row items-center">
                <Crown size={16} color="#0A0060" className="mr-1.5" />
                <Text className="text-gray-900 font-black text-lg">Explorer</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Points Balance</Text>
              <Text className="text-[#F4740D] font-black text-2xl tracking-tighter">0</Text>
            </View>
          </View>
          
          <View className="px-5 pb-5">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-xs font-semibold">0 pts</Text>
              <Text className="text-gray-500 text-xs font-semibold">2,500 pts to Voyager</Text>
            </View>
            <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <View className="h-full bg-[#F4740D] rounded-full" style={{ width: '5%' }} />
            </View>
          </View>

          {/* Upsell to Voyager */}
          <View className="bg-gray-50 border-t border-gray-200 p-5">
            <View className="flex-row items-start mb-4">
              <BadgePercent size={20} color="#F4740D" className="mr-3" />
              <View className="flex-1">
                <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest mb-1">
                  Upgrade to Voyager
                </Text>
                <Text className="text-gray-600 text-xs leading-relaxed mb-2">
                  Earn 1.5x points on every booking and unlock free cancellation on select fares.
                </Text>
                <View className="flex-row items-center mb-1">
                  <CheckCircle2 size={12} color="#1E7A34" />
                  <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-1">GHS 60 / Month</Text>
                </View>
              </View>
            </View>
            
            <Pressable 
              onPress={handleUpgrade}
              className="bg-[#0A0060] items-center justify-center w-full"
              style={{ height: 40, borderRadius: 4 }}
            >
              <Text className="text-white font-black text-xs tracking-widest uppercase">Upgrade Now</Text>
            </Pressable>
          </View>

        </View>

        {/* Quick Access List */}
        <Text className="text-lg font-black text-[#0A0060] mb-4">Quick Access</Text>
        <View className="bg-white border border-gray-200 mb-8" style={{ borderRadius: 8 }}>
          {QUICK_ACCESS_ITEMS.map((item, index) => (
            <Pressable 
              key={item.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(item.route as any);
              }}
              className={`flex-row items-center justify-between p-5 bg-white ${
                index !== QUICK_ACCESS_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View className="flex-row items-center">
                <item.icon size={20} color="#0A0060" />
                <Text className="ml-4 font-bold text-gray-900 text-sm">{item.title}</Text>
              </View>
              <ChevronRight size={18} color="#D1D5DB" />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <Pressable 
          onPress={onLogout}
          className="flex-row items-center justify-center bg-white border border-red-200"
          style={{ height: 56, borderRadius: 4 }}
        >
          <LogOut size={20} color="#DC2626" />
          <Text className="text-red-600 font-black text-sm uppercase tracking-widest ml-2">Sign Out</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert('Error', 'Failed to sign out');
          } else {
            router.replace('/auth/login');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {user ? (
        <MemberProfileView user={user} onLogout={handleLogout} />
      ) : (
        <GuestProfileView onLogin={() => router.push('/auth/login')} />
      )}
    </SafeAreaView>
  );
}
