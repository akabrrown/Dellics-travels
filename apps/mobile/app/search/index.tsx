import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MapPin, Plane, Bed, Car, Ticket, Calendar, Users, Search, Map } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../src/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSearchStore } from '../../src/store/useSearchStore';

type Tab = 'FLIGHTS' | 'HOTELS' | 'PACKAGES' | 'CARS' | 'ACTIVITIES';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'FLIGHTS', label: 'Flights', icon: Plane },
  { id: 'HOTELS', label: 'Hotels', icon: Bed },
  { id: 'PACKAGES', label: 'Packages', icon: Map },
  { id: 'CARS', label: 'Cars', icon: Car },
  { id: 'ACTIVITIES', label: 'Activities', icon: Ticket },
];

export default function SearchScreen() {
  const router = useRouter();
  const { mode, origin: initialOrigin, destination: initialDestination } = useLocalSearchParams<{ mode?: string, origin?: string, destination?: string }>();
  
  const [activeTab, setActiveTab] = useState<Tab>((mode?.toUpperCase() as Tab) || 'FLIGHTS');
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const { dates, checkInDate, checkOutDate, travelers, roomsAndGuests, locations } = useSearchStore();

  const isNavigating = useRef(false);
  const navigateOnce = (path: string) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    router.push(path as any);
    setTimeout(() => {
      isNavigating.current = false;
    }, 600);
  };

  const flightOrigin = locations.flightOrigin || initialOrigin || '';
  const flightDestination = locations.flightDestination || initialDestination || '';
  const hotelDestination = locations.hotelDestination || initialDestination || '';
  const carOrigin = locations.carOrigin || initialOrigin || '';
  const carDestination = locations.carDestination || initialDestination || '';
  const genericDestination = locations.genericDestination || initialDestination || '';
  
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [businessTravel, setBusinessTravel] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session);
      }
    });
  }, []);

  const fetchUserProfile = async (id: string, currentSession: any) => {
    try {
      const { data } = await supabase
        .from('User')
        .select('name')
        .eq('id', id)
        .single();
        
      setUserProfile({
        firstName: data?.name?.split(' ')[0] || currentSession?.user?.user_metadata?.name?.split(' ')[0] || currentSession?.user?.user_metadata?.first_name || 'Traveler',
      });
    } catch (e) {
      setUserProfile({
        firstName: currentSession?.user?.user_metadata?.name?.split(' ')[0] || currentSession?.user?.user_metadata?.first_name || 'Traveler',
      });
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let o = '';
    let d = '';
    switch (activeTab) {
      case 'FLIGHTS':
        o = flightOrigin.trim() || 'Accra';
        d = flightDestination.trim() || 'London';
        break;
      case 'HOTELS':
        o = 'Any';
        d = hotelDestination.trim() || 'London';
        break;
      case 'CARS':
        o = carOrigin.trim() || 'London';
        d = carDestination.trim() || 'London';
        break;
      default:
        o = 'Any';
        d = genericDestination.trim() || 'London';
        break;
    }
    router.push(`/results/${o}_${d}?mode=${activeTab}`);
  };

  const handleInspireMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/results/ANY_WHERE?mode=INSPIRE');
  };

  const renderFlightForm = () => (
    <View>
      <View className="mb-4">
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Origin</Text>
        <Pressable 
          onPress={() => navigateOnce('/search/location?field=flightOrigin')}
          className="border border-gray-300 flex-row items-center px-4 bg-gray-50/50" 
          style={{ height: 52, borderRadius: 8 }}
        >
          <Plane size={18} color="#9CA3AF" />
          <Text className={`flex-1 ml-3 text-base font-bold ${flightOrigin ? 'text-gray-900' : 'text-gray-400'}`}>
            {flightOrigin || 'Where from? (e.g. Accra)'}
          </Text>
        </Pressable>
      </View>
      <View className="mb-5">
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination</Text>
        <Pressable 
          onPress={() => navigateOnce('/search/location?field=flightDestination')}
          className="border border-gray-300 flex-row items-center px-4 bg-gray-50/50" 
          style={{ height: 52, borderRadius: 8 }}
        >
          <MapPin size={18} color="#9CA3AF" />
          <Text className={`flex-1 ml-3 text-base font-bold ${flightDestination ? 'text-gray-900' : 'text-gray-400'}`}>
            {flightDestination || 'Where to? (e.g. London)'}
          </Text>
        </Pressable>
      </View>
      
      <View className="flex-row justify-between mb-5">
        <Pressable 
          onPress={() => navigateOnce('/search/dates')}
          style={{ width: '48%' }}
        >
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dates</Text>
          <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
            <Calendar size={18} color="#0A0060" />
            <Text className="ml-3 text-sm text-gray-900 font-bold">{dates}</Text>
          </View>
        </Pressable>
        <Pressable 
          onPress={() => navigateOnce('/search/travelers?mode=FLIGHTS')}
          style={{ width: '48%' }}
        >
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Travelers</Text>
          <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
            <Users size={18} color="#0A0060" />
            <Text className="ml-3 text-sm text-gray-900 font-bold">{travelers}</Text>
          </View>
        </Pressable>
      </View>

      <View className="flex-row justify-between mb-2">
        <Pressable 
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setFlexibleDates(!flexibleDates); }}
          className="flex-row items-center p-2 -ml-2"
        >
          <View className={`w-5 h-5 border ${flexibleDates ? 'border-[#0A0060] bg-[#0A0060]' : 'border-gray-300 bg-white'} items-center justify-center mr-2`} style={{ borderRadius: 4 }}>
            {flexibleDates && <View className="w-2 h-2 bg-white rounded-sm" />}
          </View>
          <Text className="text-gray-700 font-medium text-xs">Flexible dates</Text>
        </Pressable>
        <Pressable 
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setBusinessTravel(!businessTravel); }}
          className="flex-row items-center p-2 -mr-2"
        >
          <View className={`w-5 h-5 border ${businessTravel ? 'border-[#0A0060] bg-[#0A0060]' : 'border-gray-300 bg-white'} items-center justify-center mr-2`} style={{ borderRadius: 4 }}>
            {businessTravel && <View className="w-2 h-2 bg-white rounded-sm" />}
          </View>
          <Text className="text-gray-700 font-medium text-xs">Traveling for work</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderHotelForm = () => (
    <View>
      <View className="mb-5">
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination or Property</Text>
        <Pressable 
          onPress={() => router.push('/search/location?field=hotelDestination')}
          className="border border-gray-300 flex-row items-center px-4 bg-gray-50/50" 
          style={{ height: 52, borderRadius: 8 }}
        >
          <Bed size={18} color="#9CA3AF" />
          <Text className={`flex-1 ml-3 text-base font-bold ${hotelDestination ? 'text-gray-900' : 'text-gray-400'}`}>
            {hotelDestination || 'Where are you staying?'}
          </Text>
        </Pressable>
      </View>
      
      <View className="flex-row justify-between mb-5">
        <Pressable 
          onPress={() => navigateOnce('/search/dates?target=checkin')}
          style={{ width: '48%' }}
        >
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Check-in</Text>
          <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
            <Calendar size={18} color="#0A0060" />
            <Text className="ml-3 text-sm text-gray-900 font-bold">{checkInDate !== 'Select' ? checkInDate : dates.split(' - ')[0] || 'Check-in'}</Text>
          </View>
        </Pressable>
        <Pressable 
          onPress={() => navigateOnce('/search/dates?target=checkout')}
          style={{ width: '48%' }}
        >
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Check-out</Text>
          <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
            <Calendar size={18} color="#0A0060" />
            <Text className="ml-3 text-sm text-gray-900 font-bold">{checkOutDate !== 'Select' ? checkOutDate : dates.split(' - ')[1] || 'Check-out'}</Text>
          </View>
        </Pressable>
      </View>

      <View className="mb-2">
        <Pressable 
          onPress={() => router.push('/search/travelers?mode=HOTELS')}
        >
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rooms & Guests</Text>
          <View className="border border-gray-300 bg-white flex-row items-center px-4" style={{ height: 52, borderRadius: 8 }}>
            <Users size={18} color="#0A0060" />
            <Text className="ml-3 text-sm text-gray-900 font-bold">{roomsAndGuests}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );

  const renderCarForm = () => (
    <View>
      <View className="mb-5">
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pick-up Location</Text>
        <Pressable 
          onPress={() => router.push('/search/location?field=carOrigin')}
          className="border border-gray-300 flex-row items-center px-4 bg-gray-50/50" 
          style={{ height: 52, borderRadius: 8 }}
        >
          <MapPin size={18} color="#9CA3AF" />
          <Text className={`flex-1 ml-3 text-base font-bold ${carOrigin ? 'text-gray-900' : 'text-gray-400'}`}>
            {carOrigin || 'Airport or City'}
          </Text>
        </Pressable>
      </View>
      
      <View className="flex-row justify-between mb-2">
        <Pressable 
          onPress={() => router.push('/search/dates')}
          style={{ width: '48%' }}
        >
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pick-up Date</Text>
          <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
            <Calendar size={18} color="#0A0060" />
            <Text className="ml-3 text-sm text-gray-900 font-bold">{dates.split(' - ')[0] || dates}</Text>
          </View>
        </Pressable>
        <Pressable 
          onPress={() => router.push('/search/dates')}
          style={{ width: '48%' }}
        >
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Drop-off Date</Text>
          <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
            <Calendar size={18} color="#0A0060" />
            <Text className="ml-3 text-sm text-gray-900 font-bold">{dates.split(' - ')[1] || 'Select'}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );

  const renderGenericForm = () => (
    <View>
      <View className="mb-5">
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination</Text>
        <Pressable 
          onPress={() => router.push('/search/location?field=genericDestination')}
          className="border border-gray-300 flex-row items-center px-4 bg-gray-50/50" 
          style={{ height: 52, borderRadius: 8 }}
        >
          <MapPin size={18} color="#9CA3AF" />
          <Text className={`flex-1 ml-3 text-base font-bold ${genericDestination ? 'text-gray-900' : 'text-gray-400'}`}>
            {genericDestination || 'Where are you going?'}
          </Text>
        </Pressable>
      </View>
      <Pressable 
        onPress={() => router.push('/search/dates')}
        className="mb-2"
      >
        <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dates</Text>
        <View className="border border-gray-300 bg-white flex-row items-center px-4" style={{ height: 52, borderRadius: 8 }}>
          <Calendar size={18} color="#0A0060" />
          <Text className="ml-3 text-sm text-gray-900 font-bold">{dates}</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
          <Pressable 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.canGoBack() ? router.back() : router.replace('/');
            }}
            className="p-2 mr-2"
          >
            <ChevronLeft size={24} color="#0A0060" />
          </Pressable>
          <Text className="text-xl font-black text-[#0A0060]">Search</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Guest / Member Banner */}
          <View className="px-6 py-6">
            {!session ? (
              <View className="bg-gray-100 border border-gray-200 p-4" style={{ borderRadius: 8 }}>
                <Text className="text-[#0A0060] font-bold mb-1">Unlock Member Savings</Text>
                <Text className="text-gray-600 text-sm mb-3">Sign in to unlock up to 30% off select routes and earn Dellics points.</Text>
                <Pressable onPress={() => router.push('/auth/login')} className="self-start">
                  <Text className="text-[#F4740D] font-bold text-sm uppercase tracking-widest">Sign In</Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row items-center">
                <View className="bg-[#F4740D] w-2 h-2 rounded-full mr-2" />
                <Text className="text-[#0A0060] font-bold text-sm tracking-widest uppercase">
                  {getGreeting()}, {userProfile?.firstName || 'Traveler'}
                </Text>
              </View>
            )}
          </View>

          {/* Horizontal Tabs */}
          <View className="border-b border-gray-200 mb-6">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <Pressable 
                    key={tab.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setActiveTab(tab.id);
                    }}
                    className={`mr-8 pb-4 items-center flex-row ${isActive ? 'border-b-2 border-[#0A0060]' : ''}`}
                  >
                    <Icon size={16} color={isActive ? '#0A0060' : '#9CA3AF'} className="mr-2" />
                    <Text className={`text-sm ${isActive ? 'font-black text-[#0A0060]' : 'font-bold text-gray-400'}`}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Form Area */}
          <View className="px-6 mb-8">
            <View className="bg-white border border-gray-200 p-5 shadow-sm" style={{ borderRadius: 12 }}>
              
              {activeTab === 'FLIGHTS' && renderFlightForm()}
              {activeTab === 'HOTELS' && renderHotelForm()}
              {activeTab === 'CARS' && renderCarForm()}
              {(activeTab === 'PACKAGES' || activeTab === 'ACTIVITIES') && renderGenericForm()}
              
              {/* Search CTA */}
              <Pressable 
                onPress={handleSearch}
                className="bg-[#F4740D] items-center justify-center flex-row mt-6"
                style={{ height: 56, borderRadius: 8 }}
              >
                <Search size={20} color="#FFF" />
                <Text className="text-white font-black text-lg ml-2">Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).toLowerCase()}</Text>
              </Pressable>
              
              {session && (
                <Text className="text-center text-[#1E7A34] font-bold text-xs mt-3 uppercase tracking-widest">
                  Member Pricing Applies
                </Text>
              )}
            </View>
          </View>

          {/* Inspire Me / Everywhere Search */}
          <View className="px-6 mb-12">
            <Text className="text-[#0A0060] font-black text-lg mb-4">Not sure where to go?</Text>
            <Pressable 
              onPress={handleInspireMe}
              className="border border-[#0A0060] bg-white items-center justify-center"
              style={{ height: 56, borderRadius: 8 }}
            >
              <Text className="text-[#0A0060] font-black text-base uppercase tracking-widest">Inspire Me</Text>
            </Pressable>
            <Text className="text-center text-gray-500 text-xs mt-3 px-4">
              We'll show you the cheapest flights to anywhere in the world.
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
