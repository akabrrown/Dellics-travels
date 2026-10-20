import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripsSkeleton } from '../../src/components/Skeleton';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';
import { Plane, Bed, Share2, MapPin, DownloadCloud, Clock, CalendarDays, BellRing } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

function GuestTripsView({ onLogin }: { onLogin: () => void }) {
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-8">
        <View className="w-16 h-16 bg-[#F9FAFB] border border-gray-200 items-center justify-center mb-6" style={{ borderRadius: 8 }}>
          <MapPin size={32} color="#0A0060" />
        </View>
        <Text className="text-2xl font-black text-[#0A0060] text-center mb-3">
          Manage all your trips in one place
        </Text>
        <Text className="text-gray-500 text-center text-sm mb-8 leading-relaxed">
          Sign in to access your digital itinerary hub and enjoy a frictionless travel experience.
        </Text>
      </View>

      <View className="mb-10">
        <View className="flex-row items-start mb-6">
          <CalendarDays size={20} color="#F4740D" className="mt-0.5 mr-4" />
          <View className="flex-1">
            <Text className="text-[#0A0060] font-bold mb-1 text-base">Auto-Organized Timeline</Text>
            <Text className="text-gray-500 text-sm">All your flights, hotels, and activities neatly arranged in a chronological itinerary.</Text>
          </View>
        </View>
        <View className="flex-row items-start mb-6">
          <DownloadCloud size={20} color="#F4740D" className="mt-0.5 mr-4" />
          <View className="flex-1">
            <Text className="text-[#0A0060] font-bold mb-1 text-base">Offline Access</Text>
            <Text className="text-gray-500 text-sm">Your boarding passes and hotel vouchers are cached on your device. No internet required.</Text>
          </View>
        </View>
        <View className="flex-row items-start">
          <BellRing size={20} color="#F4740D" className="mt-0.5 mr-4" />
          <View className="flex-1">
            <Text className="text-[#0A0060] font-bold mb-1 text-base">Real-Time Alerts</Text>
            <Text className="text-gray-500 text-sm">Instant push notifications for flight delays, gate changes, and check-in reminders.</Text>
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
        <Text className="text-white font-black text-sm tracking-widest uppercase">Sign In to View Trips</Text>
      </Pressable>
    </View>
  );
}

function MemberTripsView() {
  const router = useRouter();
  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: 'Check out my upcoming trip to London on Dellics Travels: https://dellicstravels.com/trip/dlx-9281',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Text className="text-xl font-black text-[#0A0060]">My Trips</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View className="flex-row justify-between items-end mb-6">
          <Text className="text-lg font-black text-[#0A0060]">Upcoming</Text>
          <Pressable onPress={handleShare} className="flex-row items-center">
            <Share2 size={16} color="#F4740D" />
            <Text className="text-[#F4740D] font-bold text-xs uppercase tracking-widest ml-1">Share Trip</Text>
          </Pressable>
        </View>

        {/* Trip Container */}
        <Pressable 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/trips/dlx-9281');
          }}
          className="bg-white p-5 border border-gray-200 mb-8" 
          style={{ borderRadius: 8 }}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-xl font-black text-gray-900 mb-1 tracking-tight">London Getaway</Text>
              <Text className="text-gray-500 font-semibold text-xs">Oct 15 - Oct 22, 2026</Text>
            </View>
            <View className="bg-orange-50 px-3 py-1.5" style={{ borderRadius: 4 }}>
              <Text className="text-[#F4740D] text-[10px] font-bold uppercase tracking-widest">Upcoming</Text>
            </View>
          </View>
          <View className="flex-row items-center border-t border-gray-100 pt-4">
            <View className="w-8 h-8 bg-[#F9FAFB] border border-gray-200 rounded-full items-center justify-center mr-3">
              <Plane size={14} color="#0A0060" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-900">Flight to London</Text>
              <Text className="text-xs text-gray-500 font-semibold mt-0.5">Departs Oct 15 • 10:00 AM</Text>
            </View>
          </View>
        </Pressable>

        <Text className="text-lg font-black text-[#0A0060] mb-4 mt-4">Past Trips</Text>
        
        <View className="bg-white p-4 border border-gray-200 mb-4 flex-row justify-between items-center" style={{ borderRadius: 8 }}>
          <View>
            <Text className="text-base font-black text-gray-900 mb-1">Dubai, UAE</Text>
            <Text className="text-gray-500 font-semibold text-xs">Jan 10 - Jan 15, 2025</Text>
          </View>
          <View className="bg-gray-100 px-2 py-1 rounded-sm">
            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Completed</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

export default function TripsScreen() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <TripsSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {session ? (
        <MemberTripsView />
      ) : (
        <GuestTripsView onLogin={() => router.push('/auth/login')} />
      )}
    </SafeAreaView>
  );
}
