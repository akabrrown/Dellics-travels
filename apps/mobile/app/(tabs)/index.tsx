import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, ImageBackground, Dimensions, Platform, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin, Plane, Bed, Crown, ChevronRight, Car, Ticket, Smartphone, PlaneTakeoff, PlaneLanding, Calendar, Users, Briefcase, Bell, ArrowDownUp, Compass, Clock, ShieldCheck, Trophy, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../src/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Network from 'expo-network';
import { useSearchStore } from '../../src/store/useSearchStore';
import { api } from '../../src/lib/api';
import { Skeleton } from '../../src/components/Skeleton';

export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [activeTab, setActiveTab] = useState('FLIGHTS');
  
  const { dates, checkInDate, checkOutDate, travelers, roomsAndGuests, locations, setLocation } = useSearchStore();
  const isNavigating = useRef(false);

  const navigateOnce = (path: string) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    router.push(path as any);
    setTimeout(() => {
      isNavigating.current = false;
    }, 600);
  };

  const [homeDeals, setHomeDeals] = useState<any[]>([]);
  const [trendingDestinations, setTrendingDestinations] = useState<any[]>([]);
  const [isHomeDealsLoading, setIsHomeDealsLoading] = useState(true);

  // Determine current origin/destination based on active tab
  let origin = '';
  let destination = '';
  
  switch (activeTab) {
    case 'FLIGHTS':
      origin = locations.flightOrigin || '';
      destination = locations.flightDestination || '';
      break;
    case 'HOTELS':
      origin = 'Any';
      destination = locations.hotelDestination || '';
      break;
    case 'CARS':
      origin = locations.carOrigin || '';
      destination = locations.carDestination || '';
      break;
    case 'PACKAGES':
    case 'ACTIVITIES':
    default:
      origin = 'Any';
      destination = locations.genericDestination || '';
      break;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id, currentSession);
      }
    });

    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setIsOffline(!state.isConnected && !state.isInternetReachable);
      } catch (e) {
        // Handle error gracefully
      }
    };
    checkNetwork();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id, currentSession);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchHomeDeals = async () => {
      try {
        setIsHomeDealsLoading(true);
        const originCode = locations.flightOrigin || 'ACC';
        const res = await api.get(`/search/home-deals?origin=${originCode}`);
        if (res.data?.data) {
          setHomeDeals(res.data.data.deals || []);
          setTrendingDestinations(res.data.data.trending || []);
        }
      } catch (e) {
        console.error('Failed to load home deals from API:', e);
      } finally {
        setIsHomeDealsLoading(false);
      }
    };

    fetchHomeDeals();
  }, [locations.flightOrigin]);

  const fetchUserProfile = async (id: string, currentSession: any) => {
    try {
      const { data } = await supabase
        .from('User')
        .select('name, points')
        .eq('id', id)
        .single();

      const meta = currentSession?.user?.user_metadata || {};
      const firstName =
        meta.full_name?.split(' ')[0] ||
        data?.name?.split(' ')[0] ||
        meta.name?.split(' ')[0] ||
        meta.first_name ||
        'Traveler';

      setUserProfile({ firstName, points: data?.points || 0 });

      // Pre-fill origin from home airport saved during profile setup
      if (meta.home_airport && !locations.flightOrigin) {
        setLocation('flightOrigin', meta.home_airport);
      }
    } catch (e) {
      const meta = currentSession?.user?.user_metadata || {};
      setUserProfile({
        firstName:
          meta.full_name?.split(' ')[0] ||
          meta.name?.split(' ')[0] ||
          meta.first_name ||
          'Traveler',
        points: 0,
      });
      if (currentSession?.user?.user_metadata?.home_airport && !locations.flightOrigin) {
        setLocation('flightOrigin', currentSession.user.user_metadata.home_airport);
      }
    }
  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeTab === 'FLIGHTS') {
      const tempO = locations.flightOrigin;
      setLocation('flightOrigin', locations.flightDestination);
      setLocation('flightDestination', tempO);
    } else if (activeTab === 'CARS') {
      const tempO = locations.carOrigin;
      setLocation('carOrigin', locations.carDestination);
      setLocation('carDestination', tempO);
    }
  };

  const handleSearchPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Offline Check
    const state = await Network.getNetworkStateAsync();
    if (!state.isConnected) {
      Alert.alert('You are offline', 'Please connect to the internet to search for flights and hotels.');
      return;
    }
    
    const routeName = `/results/${activeTab.toLowerCase()}`;
    router.push({ pathname: routeName as any, params: { origin, destination } });
  };

  const handleInspireMe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const state = await Network.getNetworkStateAsync();
    if (!state.isConnected) {
      Alert.alert('You are offline', 'Please connect to the internet to explore destinations.');
      return;
    }
    
    router.push({ pathname: '/search', params: { mode: 'INSPIRE' } });
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        
        {/* User Header & Profile */}
        {isOffline && (
          <View className="bg-red-50 py-2 px-6 flex-row justify-center items-center">
            <Text className="text-red-600 font-bold text-xs uppercase tracking-widest">You are currently offline</Text>
          </View>
        )}
        <View className="px-6 pt-4 pb-6 flex-row justify-between items-center">
          <Pressable onPress={() => router.push('/profile')} className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} className="w-full h-full" />
            </View>
            <Text className="text-xl font-black text-[#0A0060]">
              {session ? (userProfile?.firstName || 'Traveler') : 'Guest'}
            </Text>
          </Pressable>
          <Pressable onPress={() => router.push('/notifications')} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200">
            <Bell color="#0A0060" size={20} />
          </Pressable>
        </View>


        {/* Unified Search Tabs */}
        <View className="px-6 mb-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <Pressable 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab('FLIGHTS'); }}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${activeTab === 'FLIGHTS' ? 'bg-[#0A0060]' : 'bg-gray-200'}`}
            >
              <Plane size={16} color={activeTab === 'FLIGHTS' ? 'white' : '#374151'} />
              <Text className={`${activeTab === 'FLIGHTS' ? 'text-white font-bold' : 'text-gray-700 font-medium'} text-sm ml-2`}>Flights</Text>
            </Pressable>
            <Pressable 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab('HOTELS'); }}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${activeTab === 'HOTELS' ? 'bg-[#0A0060]' : 'bg-gray-200'}`}
            >
              <Bed size={16} color={activeTab === 'HOTELS' ? 'white' : '#374151'} />
              <Text className={`${activeTab === 'HOTELS' ? 'text-white font-bold' : 'text-gray-700 font-medium'} text-sm ml-2`}>Hotels</Text>
            </Pressable>
            <Pressable 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab('PACKAGES'); }}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${activeTab === 'PACKAGES' ? 'bg-[#0A0060]' : 'bg-gray-200'}`}
            >
              <Briefcase size={16} color={activeTab === 'PACKAGES' ? 'white' : '#374151'} />
              <Text className={`${activeTab === 'PACKAGES' ? 'text-white font-bold' : 'text-gray-700 font-medium'} text-sm ml-2`}>Packages</Text>
            </Pressable>
            <Pressable 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab('CARS'); }}
              className={`flex-row items-center px-4 py-2 rounded-full mr-6 ${activeTab === 'CARS' ? 'bg-[#0A0060]' : 'bg-gray-200'}`}
            >
              <Car size={16} color={activeTab === 'CARS' ? 'white' : '#374151'} />
              <Text className={`${activeTab === 'CARS' ? 'text-white font-bold' : 'text-gray-700 font-medium'} text-sm ml-2`}>Cars</Text>
            </Pressable>
            <Pressable 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab('ACTIVITIES'); }}
              className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${activeTab === 'ACTIVITIES' ? 'bg-[#0A0060]' : 'bg-gray-200'}`}
            >
              <Ticket size={16} color={activeTab === 'ACTIVITIES' ? 'white' : '#374151'} />
              <Text className={`${activeTab === 'ACTIVITIES' ? 'text-white font-bold' : 'text-gray-700 font-medium'} text-sm ml-2`}>Activities</Text>
            </Pressable>
            <Pressable 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/esim'); }}
              className={`flex-row items-center px-4 py-2 rounded-full mr-6 bg-gray-200`}
            >
              <Smartphone size={16} color="#374151" />
              <Text className={`text-gray-700 font-medium text-sm ml-2`}>eSIM</Text>
            </Pressable>
          </ScrollView>

          {/* Dynamic Search Widget */}
          <View className="bg-white border border-gray-200 p-5 shadow-sm" style={{ borderRadius: 12 }}>
            {activeTab === 'FLIGHTS' && (
              <View>
                <View className="mb-4">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Origin</Text>
                  <View className="border border-gray-300 flex-row items-center bg-gray-50/50" style={{ height: 52, borderRadius: 8 }}>
                    <Pressable 
                      onPress={() => router.push('/search/location?field=flightOrigin')}
                      className="flex-1 flex-row items-center pl-4 h-full" 
                    >
                      <Plane size={18} color="#9CA3AF" />
                      <Text className={`flex-1 ml-3 text-base font-bold ${origin ? 'text-gray-900' : 'text-gray-400'}`}>
                        {origin || 'Where from? (e.g. Accra)'}
                      </Text>
                    </Pressable>
                    {origin && (
                      <Pressable onPress={() => setLocation('flightOrigin', '')} className="px-4 h-full justify-center absolute right-0">
                        <X size={16} color="#9CA3AF" />
                      </Pressable>
                    )}
                  </View>
                </View>
                <View className="mb-5 relative">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination</Text>
                  <View className="border border-gray-300 flex-row items-center bg-gray-50/50" style={{ height: 52, borderRadius: 8 }}>
                    <Pressable 
                      onPress={() => router.push('/search/location?field=flightDestination')}
                      className="flex-1 flex-row items-center pl-4 h-full" 
                    >
                      <MapPin size={18} color="#9CA3AF" />
                      <Text className={`flex-1 ml-3 text-base font-bold pr-24 ${destination ? 'text-gray-900' : 'text-gray-400'}`}>
                        {destination || 'Where to? (e.g. London)'}
                      </Text>
                    </Pressable>
                    {destination ? (
                      <Pressable onPress={() => setLocation('flightDestination', '')} className="px-4 h-full justify-center absolute right-0">
                        <X size={16} color="#9CA3AF" />
                      </Pressable>
                    ) : (
                      <Pressable 
                        onPress={handleInspireMe}
                        className="absolute right-4 bg-[#0A0060]/10 px-3 py-1.5 rounded-full"
                      >
                        <Text className="text-[#0A0060] font-bold text-xs uppercase tracking-wider">Anywhere</Text>
                      </Pressable>
                    )}
                  </View>
                  {/* Swap Button */}
                  <Pressable 
                    onPress={handleSwap}
                    className="absolute right-4 -top-8 bg-white border border-gray-200 rounded-full w-10 h-10 items-center justify-center z-10 shadow-sm"
                  >
                    <ArrowDownUp color="#F4740D" size={16} />
                  </Pressable>
                </View>
                
                <View className="flex-row justify-between mb-5">
                  <Pressable 
                    onPress={() => navigateOnce('/search/dates?target=checkin')}
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
              </View>
            )}

            {activeTab === 'HOTELS' && (
              <View>
                <View className="mb-5">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination or Property</Text>
                  <View className="border border-gray-300 flex-row items-center bg-gray-50/50" style={{ height: 52, borderRadius: 8 }}>
                    <Pressable 
                      onPress={() => router.push('/search/location?field=hotelDestination')}
                      className="flex-1 flex-row items-center pl-4 h-full" 
                    >
                      <Bed size={18} color="#9CA3AF" />
                      <Text className={`flex-1 ml-3 text-base font-bold ${destination ? 'text-gray-900' : 'text-gray-400'}`}>
                        {destination || 'Where are you staying?'}
                      </Text>
                    </Pressable>
                    {destination && (
                      <Pressable onPress={() => setLocation('hotelDestination', '')} className="px-4 h-full justify-center absolute right-0">
                        <X size={16} color="#9CA3AF" />
                      </Pressable>
                    )}
                  </View>
                </View>
                
                <View className="flex-row justify-between mb-5">
                  <Pressable 
                    onPress={() => navigateOnce('/search/dates?target=checkin&mode=HOTELS')}
                    style={{ width: '48%' }}
                  >
                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Check-in</Text>
                    <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
                      <Calendar size={18} color="#0A0060" />
                      <Text className="ml-3 text-sm text-gray-900 font-bold">{checkInDate !== 'Select' ? checkInDate : dates.split(' - ')[0] || 'Check-in'}</Text>
                    </View>
                  </Pressable>
                  <Pressable 
                    onPress={() => navigateOnce('/search/dates?target=checkout&mode=HOTELS')}
                    style={{ width: '48%' }}
                  >
                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Check-out</Text>
                    <View className="border border-gray-300 bg-white flex-row items-center px-3" style={{ height: 52, borderRadius: 8 }}>
                      <Calendar size={18} color="#0A0060" />
                      <Text className="ml-3 text-sm text-gray-900 font-bold">{checkOutDate !== 'Select' ? checkOutDate : dates.split(' - ')[1] || 'Check-out'}</Text>
                    </View>
                  </Pressable>
                </View>

                <View className="mb-5">
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
            )}

            {activeTab === 'PACKAGES' && (
              <View>
                <View className="mb-5">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination</Text>
                  <View className="border border-gray-300 flex-row items-center bg-gray-50/50" style={{ height: 52, borderRadius: 8 }}>
                    <Pressable 
                      onPress={() => router.push('/search/location?field=genericDestination')}
                      className="flex-1 flex-row items-center pl-4 h-full" 
                    >
                      <MapPin size={18} color="#9CA3AF" />
                      <Text className={`flex-1 ml-3 text-base font-bold ${destination ? 'text-gray-900' : 'text-gray-400'}`}>
                        {destination || 'Where to?'}
                      </Text>
                    </Pressable>
                    {destination && (
                      <Pressable onPress={() => setLocation('genericDestination', '')} className="px-4 h-full justify-center absolute right-0">
                        <X size={16} color="#9CA3AF" />
                      </Pressable>
                    )}
                  </View>
                </View>
                <Pressable 
                  onPress={() => router.push('/search/dates')}
                  className="mb-5"
                >
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dates</Text>
                  <View className="border border-gray-300 bg-white flex-row items-center px-4" style={{ height: 52, borderRadius: 8 }}>
                    <Calendar size={18} color="#0A0060" />
                    <Text className="ml-3 text-sm text-gray-900 font-bold">{dates}</Text>
                  </View>
                </Pressable>
              </View>
            )}

            {activeTab === 'CARS' && (
              <View>
                <View className="mb-5">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pick-up Location</Text>
                  <View className="border border-gray-300 flex-row items-center bg-gray-50/50" style={{ height: 52, borderRadius: 8 }}>
                    <Pressable 
                      onPress={() => router.push('/search/location?field=carOrigin')}
                      className="flex-1 flex-row items-center pl-4 h-full" 
                    >
                      <MapPin size={18} color="#9CA3AF" />
                      <Text className={`flex-1 ml-3 text-base font-bold ${origin ? 'text-gray-900' : 'text-gray-400'}`}>
                        {origin || 'Airport or City'}
                      </Text>
                    </Pressable>
                    {origin && (
                      <Pressable onPress={() => setLocation('carOrigin', '')} className="px-4 h-full justify-center absolute right-0">
                        <X size={16} color="#9CA3AF" />
                      </Pressable>
                    )}
                  </View>
                </View>
                
                <View className="flex-row justify-between mb-5">
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
            )}

            {(activeTab === 'ACTIVITIES' || activeTab === 'ESIM') && (
              <View className="mb-5">
                <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination</Text>
                <View className="border border-gray-300 flex-row items-center bg-gray-50/50" style={{ height: 52, borderRadius: 8 }}>
                  <Pressable 
                    onPress={() => router.push('/search/location?field=genericDestination')}
                    className="flex-1 flex-row items-center pl-4 h-full" 
                  >
                    <MapPin size={18} color="#9CA3AF" />
                    <Text className={`flex-1 ml-3 text-base font-bold ${destination ? 'text-gray-900' : 'text-gray-400'}`}>
                      {destination || (activeTab === 'ESIM' ? "Country or Region" : "Where are you going?")}
                    </Text>
                  </Pressable>
                  {destination && (
                    <Pressable onPress={() => setLocation('genericDestination', '')} className="px-4 h-full justify-center absolute right-0">
                      <X size={16} color="#9CA3AF" />
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            <Pressable 
              onPress={handleSearchPress} 
              className="bg-[#F4740D] items-center justify-center flex-row"
              style={{ height: 56, borderRadius: 8 }}
            >
              <Search color="white" size={20} className="mr-2" />
              <Text className="text-white font-black text-lg">
                {activeTab === 'FLIGHTS' ? 'Search flights' : 
                 activeTab === 'HOTELS' ? 'Search hotels' : 
                 activeTab === 'PACKAGES' ? 'Search packages' : 
                 activeTab === 'CARS' ? 'Search cars' : 
                 activeTab === 'ESIM' ? 'Search eSIMs' : 'Search'}
              </Text>
            </Pressable>
          </View>
          
          <View className="items-center mt-6">
            <Pressable 
              onPress={handleInspireMe}
              className="flex-row items-center justify-center bg-[#0A0060] px-6 py-3 rounded-full"
            >
              <Compass color="white" size={18} />
              <Text className="text-white font-black text-sm ml-2">Inspire me — I don't know where yet</Text>
            </Pressable>
          </View>
        </View>

        {/* Membership Banner */}
        <View className="px-6 mt-2 mb-8">
          <Pressable 
            onPress={() => router.push('/membership')}
            className="bg-[#0A0060] rounded-xl p-5 flex-row items-center justify-between shadow-sm overflow-hidden"
          >
            <View className="flex-1 pr-4">
              <View className="flex-row items-center mb-2">
                <Crown size={16} color="#F4740D" />
                <Text className="text-[#F4740D] font-bold text-xs uppercase tracking-widest ml-2">Dellics Rewards</Text>
              </View>
              <Text className="text-white font-black text-lg mb-1">Unlock Member Prices</Text>
              <Text className="text-white/80 text-sm">Earn points on every trip and save up to 15% on select hotels.</Text>
            </View>
            <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center">
              <ChevronRight color="#FFFFFF" size={20} />
            </View>
          </Pressable>
        </View>

        {/* Deals Ending Soon Section (Live Duffel & RateHawk API Data) */}
        <View className="mb-12">
          <View className="flex-row items-center justify-between px-6 mb-6">
            <Text className="text-lg font-black text-[#0A0060]">Deals ending soon</Text>
            <Pressable onPress={() => router.push('/results/packages')}>
              <Text className="text-[#F4740D] font-bold text-sm">See all</Text>
            </Pressable>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {isHomeDealsLoading ? (
              <View className="flex-row">
                <Skeleton width={280} height={200} style={{ borderRadius: 8, marginRight: 16 }} />
                <Skeleton width={280} height={200} style={{ borderRadius: 8 }} />
              </View>
            ) : (
              homeDeals.map((deal) => (
                <Pressable 
                  key={deal.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/results/packages?destination=${deal.destination}`);
                  }}
                  className="bg-white border border-gray-200 mr-4 overflow-hidden shadow-sm"
                  style={{ width: 280, borderRadius: 8 }}
                >
                  <ImageBackground 
                    source={{ uri: deal.image }} 
                    className="w-full h-36 justify-between p-3"
                  >
                    <View className="bg-black/60 self-start px-2 py-1" style={{ borderRadius: 4 }}>
                      <Text className="text-white font-bold text-[10px] uppercase tracking-widest">{deal.tag}</Text>
                    </View>
                    <Text className="text-white font-black text-2xl tracking-tight shadow-md">{deal.destination}</Text>
                  </ImageBackground>

                  <View className="p-4">
                    <Text className="font-black text-gray-900 text-lg mb-2">{deal.title}</Text>
                    
                    <View className="flex-row items-center mb-4">
                      <Clock color="#F4740D" size={14} />
                      <Text className="text-[#F4740D] font-bold text-xs ml-1">Ends in {deal.endsIn}</Text>
                    </View>

                    <View className="flex-row items-end justify-between mt-2 pt-4 border-t border-gray-100">
                      <View>
                        <Text className="text-xs text-gray-400 font-bold uppercase">Realtime Fare</Text>
                        <Text className="text-gray-900 font-black text-xl">{deal.price} <Text className="text-gray-500 font-medium text-xs">/ total</Text></Text>
                      </View>
                      <View className="bg-[#0A0060]/10 px-3 py-1.5 rounded-full">
                        <Text className="text-[#0A0060] font-black text-xs">Book Deal</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

        {/* Trending Destinations Section (Live Duffel API Data) */}
        <View className="mb-16">
          <View className="flex-row items-center justify-between px-6 mb-6">
            <Text className="text-lg font-black text-[#0A0060]">Trending destinations</Text>
            <Pressable onPress={() => router.push('/results/hotels')}>
              <Text className="text-[#F4740D] font-bold text-sm">See all</Text>
            </Pressable>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {isHomeDealsLoading ? (
              <View className="flex-row">
                <Skeleton width={140} height={180} style={{ borderRadius: 8, marginRight: 16 }} />
                <Skeleton width={140} height={180} style={{ borderRadius: 8, marginRight: 16 }} />
                <Skeleton width={140} height={180} style={{ borderRadius: 8 }} />
              </View>
            ) : (
              trendingDestinations.map((item) => (
                <Pressable 
                  key={item.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/results/hotels?destination=${item.name}`);
                  }}
                  className="bg-white border border-gray-200 mr-4 overflow-hidden shadow-sm"
                  style={{ width: 140, height: 180, borderRadius: 8 }}
                >
                  <ImageBackground 
                    source={{ uri: item.image }} 
                    className="w-full h-full p-3 justify-between"
                  >
                    <View className="bg-black/60 self-start px-2 py-1" style={{ borderRadius: 4 }}>
                      <Text className="text-white font-bold text-[10px] uppercase">{item.badge}</Text>
                    </View>
                    <View>
                      <Text className="text-white font-black text-lg shadow-sm">{item.name}</Text>
                      <Text className="text-white/90 font-bold text-xs shadow-sm">From {item.price}</Text>
                    </View>
                  </ImageBackground>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}
