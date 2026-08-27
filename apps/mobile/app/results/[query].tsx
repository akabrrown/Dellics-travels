import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, PlaneTakeoff, Clock, CheckCircle2, SearchX, Heart, SlidersHorizontal, ArrowUpDown } from 'lucide-react-native';
import { useSearchFlights } from '../../src/hooks/useSearch';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import { Skeleton } from '../../src/components/Skeleton';

const CITY_NAMES: Record<string, string> = {
  ACC: 'Accra',
  LHR: 'London',
  JFK: 'New York',
  DXB: 'Dubai',
  CDG: 'Paris',
  LOS: 'Lagos',
  ABJ: 'Abidjan',
  JNB: 'Johannesburg',
  SIN: 'Singapore',
  SYD: 'Sydney',
  BCN: 'Barcelona',
  MIA: 'Miami',
  CUN: 'Cancun',
  ZNZ: 'Zanzibar',
  HNL: 'Honolulu',
  MLE: 'Maldives',
  GIG: 'Rio de Janeiro',
  NCE: 'Nice',
  NBO: 'Nairobi',
  CPT: 'Cape Town',
  KEF: 'Reykjavik',
  YVR: 'Vancouver',
  AKL: 'Auckland',
  GVA: 'Geneva',
  FCO: 'Rome',
  CAI: 'Cairo',
  IST: 'Istanbul',
  ATH: 'Athens',
  RAK: 'Marrakesh',
  AMS: 'Amsterdam',
};

function getCityName(code: string) {
  if (!code) return '';
  const upper = code.toUpperCase();
  return CITY_NAMES[upper] || code;
}

function formatDuration(iso: string | null) {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return null;
  const h = match[1] ? `${match[1]} ${parseInt(match[1]) === 1 ? 'hour' : 'hours'}` : '';
  const m = match[2] ? `${match[2]} mins` : '';
  return [h, m].filter(Boolean).join(' ');
}

function formatTime(isoStr: string | null) {
  if (!isoStr) return null;
  try {
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return null;
  }
}

function SkeletonResult() {
  return (
    <View className="bg-white p-5 rounded-xl mb-4 border border-gray-200 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <Skeleton width={120} height={20} style={{ borderRadius: 6 }} />
        <Skeleton width={80} height={24} style={{ borderRadius: 6 }} />
      </View>
      <View className="flex-row justify-between items-center mb-6">
        <Skeleton width={80} height={32} style={{ borderRadius: 6 }} />
        <View className="flex-1 px-4">
          <Skeleton width="100%" height={2} style={{ borderRadius: 2 }} />
        </View>
        <Skeleton width={80} height={32} style={{ borderRadius: 6 }} />
      </View>
      <Skeleton width="100%" height={48} style={{ borderRadius: 8 }} />
    </View>
  );
}

function FlightCard({ 
  flight, 
  index, 
  onSelect,
  isLoggedIn
}: { 
  flight: any; 
  index: number; 
  onSelect: () => void;
  isLoggedIn: boolean;
}) {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isSaved, setIsSaved] = useState(false);

  const scarcitySeats = index === 0 ? 2 : index === 1 ? 4 : null;
  const isMemberDeal = index % 2 === 0;
  const basePrice = flight.price;
  const originalPrice = isMemberDeal ? Math.floor(basePrice * 1.2) : basePrice;
  const durationStr = formatDuration(flight.duration);
  const depTime = formatTime(flight.departureTime);
  const arrTime = formatTime(flight.arrivalTime);
  const stopsLabel = flight.stops === 0 ? 'Direct Flight (Non-stop)' : `${flight.stops} Stopover${flight.stops > 1 ? 's' : ''}`;
  const originCityName = getCityName(flight.origin);
  const destCityName = getCityName(flight.destination);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSaved(!isSaved);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable 
        onPress={onSelect}
        className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm active:opacity-95"
      >
        {scarcitySeats && (
          <View className="bg-red-50 py-2 px-4 flex-row items-center border-b border-red-100">
            <Clock size={14} color="#DC2626" />
            <Text className="text-red-600 text-xs font-bold ml-2 uppercase tracking-wider">
              Only {scarcitySeats} seats left at this price
            </Text>
          </View>
        )}

        <View className="p-5">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <View className="flex-row items-center">
                <Text className="text-sm font-black text-[#0A0060] uppercase tracking-wider mr-2">{flight.airline}</Text>
                <Pressable onPress={toggleSave} className="p-1">
                  <Heart size={18} color={isSaved ? '#F4740D' : '#9CA3AF'} fill={isSaved ? '#F4740D' : 'transparent'} />
                </Pressable>
              </View>
              <View className="flex-row items-center mt-1">
                <CheckCircle2 size={12} color="#1E7A34" />
                <Text className="text-[#1E7A34] text-xs font-bold ml-1">Free cancellation window</Text>
              </View>
            </View>
            <View className="items-end">
              {isLoggedIn && isMemberDeal && (
                <Text className="text-gray-400 text-xs font-bold line-through mb-0.5">
                  ${originalPrice}
                </Text>
              )}
              <Text className={`text-2xl font-black ${isLoggedIn && isMemberDeal ? 'text-[#F4740D]' : 'text-gray-900'}`}>
                ${basePrice}
              </Text>
              <Text className="text-gray-400 text-xs font-medium">{flight.currency || 'USD'}</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-5">
            <View>
              <Text className="text-2xl font-black text-gray-900 tracking-tight">{originCityName}</Text>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">{flight.origin}</Text>
              <Text className="text-gray-500 font-semibold text-xs mt-1">{depTime || '—'}</Text>
            </View>
            <View className="flex-1 items-center px-4">
              <View className="h-[2px] w-full bg-gray-200 relative">
                <View className="absolute -top-2.5 left-1/2 -ml-2.5 bg-white px-1">
                  <PlaneTakeoff size={16} color="#9CA3AF" />
                </View>
              </View>
              <Text className="text-gray-400 text-[10px] font-bold mt-3 tracking-wider text-center">
                {stopsLabel}{durationStr ? ` · ${durationStr}` : ''}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-black text-gray-900 tracking-tight">{destCityName}</Text>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">{flight.destination}</Text>
              <Text className="text-gray-500 font-semibold text-xs mt-1">{arrTime || '—'}</Text>
            </View>
          </View>

          <View 
            className="w-full bg-[#0A0060] py-3 items-center justify-center rounded-lg"
          >
            <Text className="text-white font-black uppercase tracking-widest text-xs">
              View Flight & Fare Details
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ResultsScreen() {
  const router = useRouter();
  const { query, mode, origin: originParam } = useLocalSearchParams<{ query: string; mode: string; origin?: string }>();
  
  const rawOrigin = originParam || 'ACC';
  const rawDest = query && query !== 'ALL' ? query : 'London';

  const originCity = getCityName(rawOrigin);
  const destCity = query === 'ALL' ? 'All Destinations' : getCityName(rawDest);

  const searchMode = mode || 'FLIGHTS';
  const [session, setSession] = useState<any>(null);
  const [activeSort, setActiveSort] = useState<'cheapest' | 'fastest' | 'nonstop'>('cheapest');

  const { data: flightsData, isLoading } = useSearchFlights({ origin: rawOrigin, destination: rawDest });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleSelectFlight = (flightId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to S15 Flight Details Screen
    router.push(`/flights/${flightId}`);
  };

  const rawFlights = flightsData?.data || [];
  
  const sortedFlights = [...rawFlights].sort((a, b) => {
    if (activeSort === 'cheapest') return (a.price || 0) - (b.price || 0);
    if (activeSort === 'nonstop') return (a.stops || 0) - (b.stops || 0);
    return 0;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* Sticky Header */}
      <View className="px-4 py-4 border-b border-gray-200 bg-white shadow-sm z-10">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Pressable 
              onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
              className="p-2 mr-2 bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} color="#0A0060" />
            </Pressable>
            <View>
              <Text className="text-[#0A0060] font-black text-lg leading-tight">
                {query === 'ALL' ? `Flights from ${originCity}` : `${originCity} to ${destCity}`}
              </Text>
              <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                {searchMode} · Live Availability
              </Text>
            </View>
          </View>
        </View>

        {/* Sorting Chips (Cheapest / Fastest / Nonstop) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
          <Pressable 
            onPress={() => { Haptics.selectionAsync(); setActiveSort('cheapest'); }}
            className={`px-4 py-2 rounded-full mr-2 border ${activeSort === 'cheapest' ? 'bg-[#0A0060] border-[#0A0060]' : 'bg-white border-gray-200'}`}
          >
            <Text className={`font-bold text-xs ${activeSort === 'cheapest' ? 'text-white' : 'text-gray-600'}`}>
              Cheapest
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => { Haptics.selectionAsync(); setActiveSort('fastest'); }}
            className={`px-4 py-2 rounded-full mr-2 border ${activeSort === 'fastest' ? 'bg-[#0A0060] border-[#0A0060]' : 'bg-white border-gray-200'}`}
          >
            <Text className={`font-bold text-xs ${activeSort === 'fastest' ? 'text-white' : 'text-gray-600'}`}>
              Fastest Route
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => { Haptics.selectionAsync(); setActiveSort('nonstop'); }}
            className={`px-4 py-2 rounded-full border ${activeSort === 'nonstop' ? 'bg-[#0A0060] border-[#0A0060]' : 'bg-white border-gray-200'}`}
          >
            <Text className={`font-bold text-xs ${activeSort === 'nonstop' ? 'text-white' : 'text-gray-600'}`}>
              Non-stop Flights
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {isLoading ? (
          <View>
            <Text className="font-bold mb-4 px-1 text-gray-500 text-sm">
              Searching for live flight deals...
            </Text>
            <SkeletonResult />
            <SkeletonResult />
            <SkeletonResult />
          </View>
        ) : sortedFlights.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-12 bg-white border border-gray-200 p-8" style={{ borderRadius: 12 }}>
            <SearchX size={48} color="#D1D5DB" className="mb-4" />
            <Text className="text-xl font-black text-[#0A0060] text-center mb-2">No flights found</Text>
            <Text className="text-gray-500 text-center mb-8 text-sm">
              We couldn't find any live flights for this route right now. Try selecting another origin airport.
            </Text>
            <Pressable 
              onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
              className="bg-[#0A0060] px-8 items-center justify-center rounded-xl"
              style={{ height: 48 }}
            >
              <Text className="text-white font-black text-sm uppercase tracking-widest">Change Route</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <View className="flex-row justify-between items-end mb-4 px-1">
              <Text className="font-bold text-gray-500 text-sm">
                {sortedFlights.length} {sortedFlights.length === 1 ? 'flight' : 'flights'} available
              </Text>
              {!session && (
                <Pressable onPress={() => router.push('/auth/login')}>
                  <Text className="text-[#F4740D] font-bold text-xs uppercase tracking-widest">
                    Sign in for Member Rates
                  </Text>
                </Pressable>
              )}
            </View>
            
            {sortedFlights.map((flight: any, index: number) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                index={index}
                isLoggedIn={!!session}
                onSelect={() => handleSelectFlight(flight.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
