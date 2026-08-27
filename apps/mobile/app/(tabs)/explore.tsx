import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Platform, StyleSheet, LayoutAnimation, TextInput, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingDown, TrendingUp, Bell, Bookmark, SlidersHorizontal, ArrowRight, RefreshCw, Plane, Search, X, Check, ExternalLink } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ExploreFilterSheet } from '../../src/components/ExploreFilterSheet';
import { api } from '../../src/lib/api';
import { Skeleton } from '../../src/components/Skeleton';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [mapReady, setMapReady] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Airport Search Modal States
  const [airportModalVisible, setAirportModalVisible] = useState(false);
  const [airportSearchQuery, setAirportSearchQuery] = useState('');
  const [airportResults, setAirportResults] = useState<any[]>([]);
  const [isSearchingAirports, setIsSearchingAirports] = useState(false);
  
  const [origin, setOrigin] = useState('ACC');
  const [originCity, setOriginCity] = useState('Accra');
  const [activeInterest, setActiveInterest] = useState('All');
  const [selectedDest, setSelectedDest] = useState<any | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [destinations, setDestinations] = useState<any[]>([]);
  const [dates, setDates] = useState<any[]>([]);
  const [activeDateId, setActiveDateId] = useState<string | null>(null);

  const fetchExploreData = async (currentOrigin = origin, currentInterest = activeInterest, targetDestIata?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let url = `/search/explore?origin=${currentOrigin}&interest=${currentInterest}`;
      if (targetDestIata) {
        url += `&destination=${targetDestIata}`;
      }

      const response = await api.get(url);
      
      const resData = response.data.data;
      setDestinations(resData.destinations || []);
      setDates(resData.dates || []);
      
      if (resData.dates && resData.dates.length > 0) {
        setActiveDateId(resData.dates[0].id);
      }

      // If a destination was selected, update selectedDest object with fresh data
      if (targetDestIata && resData.destinations) {
        const found = resData.destinations.find((d: any) => d.routeId === targetDestIata);
        if (found) setSelectedDest(found);
      } else if (resData.destinations && resData.destinations.length > 0 && !selectedDest) {
        setSelectedDest(resData.destinations[0]);
      }
    } catch (err: any) {
      console.error('Explore API Error:', err);
      setError('Failed to fetch live fares from Duffel API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, []);

  // Live Duffel Places Search for Home Airport Selector
  useEffect(() => {
    if (!airportSearchQuery || airportSearchQuery.trim().length < 2) {
      setAirportResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingAirports(true);
        const res = await api.get(`/search/places?q=${encodeURIComponent(airportSearchQuery)}&type=flight`);
        setAirportResults(res.data?.data || []);
      } catch (e) {
        console.error('Failed to search airports:', e);
      } finally {
        setIsSearchingAirports(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [airportSearchQuery]);

  const handleApplyFilter = (interest: string, length: string) => {
    setActiveInterest(interest);
    setSelectedDest(null);
    fetchExploreData(origin, interest);
  };

  const handleSelectOrigin = (item: any) => {
    const code = typeof item === 'string' ? item : item.iataCode;
    const city = typeof item === 'string' ? item : (item.cityName || item.name);
    if (!code) return;
    Haptics.selectionAsync();
    setOrigin(code);
    setOriginCity(city || code);
    setSelectedDest(null);
    setAirportModalVisible(false);
    setAirportSearchQuery('');
    setAirportResults([]);
    fetchExploreData(code, activeInterest);
  };

  const activeDateData = dates.find(d => d.id === activeDateId) || dates[0] || {};

  const handleDateSelect = (id: string) => {
    Haptics.selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveDateId(id);
  };

  const handlePinPress = (dest: any) => {
    Haptics.selectionAsync();
    setSelectedDest(dest);
    // Refetch dates and insights specifically for this selected destination
    fetchExploreData(origin, activeInterest, dest.routeId);
  };

  const renderLoader = () => (
    <View className="flex-1 px-4 py-4">
      <Skeleton width="100%" height={350} style={{ borderRadius: 16, marginBottom: 20 }} />
      <Skeleton width={120} height={20} style={{ marginBottom: 20 }} />
      <View className="flex-row justify-between mb-8">
        <Skeleton width="30%" height={80} style={{ borderRadius: 12 }} />
        <Skeleton width="30%" height={80} style={{ borderRadius: 12 }} />
        <Skeleton width="30%" height={80} style={{ borderRadius: 12 }} />
      </View>
      <Skeleton width={150} height={20} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={120} style={{ borderRadius: 16 }} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-200 bg-white">
        <View>
          <Text className="text-2xl font-black text-[#0A0060] tracking-tight">Explore</Text>
          <Text className="text-xs text-gray-500 font-bold uppercase tracking-wider">{activeInterest} Destinations</Text>
        </View>

        <View className="flex-row items-center space-x-2">
          {/* Origin selector chip */}
          <Pressable 
            onPress={() => { Haptics.selectionAsync(); setAirportModalVisible(true); }}
            className="flex-row items-center bg-[#0A0060]/10 px-3 py-1.5 rounded-full mr-1"
          >
            <Plane size={14} color="#0A0060" />
            <Text className="text-xs font-black text-[#0A0060] ml-1.5">From {originCity} ({origin})</Text>
          </Pressable>

          <Pressable 
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/explore/saved'); }}
            className="p-2"
          >
            <Bookmark size={20} color="#0A0060" />
          </Pressable>
          <Pressable 
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/explore/my-alerts'); }}
            className="p-2"
          >
            <Bell size={20} color="#0A0060" />
          </Pressable>
          <Pressable 
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setFilterVisible(true); }}
            className="p-2 bg-gray-100 rounded-full"
          >
            <SlidersHorizontal size={18} color="#0A0060" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isLoading ? renderLoader() : error ? (
          <View className="flex-1 justify-center items-center py-20 px-6">
            <Text className="text-gray-900 font-bold text-lg mb-2">Network Error</Text>
            <Text className="text-gray-500 text-center mb-6">{error}</Text>
            <Pressable 
              onPress={() => { Haptics.selectionAsync(); fetchExploreData(); }}
              className="bg-[#0A0060] px-6 py-3 rounded-full flex-row items-center"
            >
              <RefreshCw size={18} color="white" />
              <Text className="text-white font-black ml-2 uppercase">Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Real Map */}
            <View className="h-[350px] w-full bg-gray-200 relative shadow-sm">
              <MapView
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                  latitude: selectedDest ? selectedDest.lat : 20,
                  longitude: selectedDest ? selectedDest.lng : 0,
                  latitudeDelta: selectedDest ? 40 : 70,
                  longitudeDelta: selectedDest ? 40 : 70,
                }}
                onMapReady={() => setMapReady(true)}
                mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
              >
                {mapReady && destinations.map((dest, index) => {
                  const isSelected = selectedDest?.routeId === dest.routeId;
                  return (
                    <Marker
                      key={dest.id || index}
                      coordinate={{ latitude: dest.lat, longitude: dest.lng }}
                      onPress={() => handlePinPress(dest)}
                    >
                      <View 
                        className={`px-3 py-1 border-2 shadow-md ${
                          isSelected ? 'bg-[#F4740D] border-white scale-110' : 'bg-[#0A0060] border-white'
                        }`} 
                        style={{ borderRadius: 16 }}
                      >
                        <Text className="font-black text-white">{dest.price}</Text>
                        <Text className="text-[10px] text-white/90 font-bold uppercase tracking-widest">{dest.name}</Text>
                      </View>
                    </Marker>
                  );
                })}
              </MapView>
              
              {/* Selected Destination Banner */}
              <Pressable 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  const destQuery = selectedDest ? selectedDest.routeId : 'ALL';
                  router.push(`/results/${destQuery}?origin=${origin}`);
                }}
                className="absolute bottom-4 left-4 right-4 bg-white/95 p-4 rounded-xl shadow-lg border border-white flex-row items-center justify-between" 
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <View className="flex-1 mr-2">
                  <Text className="font-black text-gray-900 text-base">
                    {selectedDest ? `${originCity} to ${selectedDest.name}` : `Live Fares from ${originCity}`}
                  </Text>
                  <Text className="text-xs text-gray-500 font-semibold mt-0.5">
                    {selectedDest ? `Lowest fare: ${selectedDest.price} · Tap to view all flights` : `Showing ${activeInterest} destinations · Tap to search`}
                  </Text>
                </View>
                <View className="w-9 h-9 bg-[#F4740D] rounded-full items-center justify-center">
                  <ExternalLink size={18} color="white" />
                </View>
              </Pressable>
            </View>

            {/* Date Grid */}
            <View className="px-6 py-8 bg-white z-10 -mt-2" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
              <View className="flex-row justify-between items-end mb-5">
                <View>
                  <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest">Cheapest Dates</Text>
                  <Text className="text-xs text-gray-500 font-bold mt-0.5">
                    {selectedDest ? `${originCity} to ${selectedDest.name}` : `From ${originCity}`}
                  </Text>
                </View>
                <Text className="text-gray-400 font-bold text-xs uppercase">LIVE TRENDS</Text>
              </View>

              <View className="flex-row mb-8">
                {dates.map((date, idx) => {
                  const isActive = activeDateId === date.id;
                  return (
                    <Pressable 
                      key={date.id}
                      onPress={() => handleDateSelect(date.id)}
                      className={`flex-1 p-3 items-center border ${isActive ? 'bg-[#0A0060] border-[#0A0060]' : 'bg-white border-gray-200'}`} 
                      style={{ borderRadius: 12, marginRight: idx === dates.length - 1 ? 0 : 8 }}
                    >
                      <Text className={`text-xs uppercase font-bold mb-1 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{date.label}</Text>
                      <Text className={`font-black text-lg ${isActive ? 'text-white' : 'text-gray-900'}`}>{date.price}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Dynamic Price Trend Chart */}
              {activeDateData.id && (
                <>
                  <Text className="text-[#0A0060] font-black text-sm uppercase tracking-widest mb-1">Price Insight</Text>
                  <Text className="text-gray-500 text-xs mb-5 font-semibold">
                    For {selectedDest ? selectedDest.name : originCity} departing {activeDateData.label}
                  </Text>
                  
                  <View 
                    className={`p-6 border justify-center items-center mb-6 shadow-sm ${
                      activeDateData.trend === 'down' ? 'bg-green-50 border-green-200' : 
                      activeDateData.trend === 'up' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`} 
                    style={{ borderRadius: 16 }}
                  >
                    {activeDateData.trend === 'down' ? (
                      <TrendingDown color="#16a34a" size={32} />
                    ) : activeDateData.trend === 'up' ? (
                      <TrendingUp color="#dc2626" size={32} />
                    ) : (
                      <TrendingDown color="#4b5563" size={32} style={{ opacity: 0.5 }} />
                    )}
                    <Text className={`font-black text-xl mt-3 ${
                      activeDateData.trend === 'down' ? 'text-green-700' : 
                      activeDateData.trend === 'up' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {activeDateData.action}
                    </Text>
                    <Text className={`font-bold text-xs mt-1 text-center ${
                      activeDateData.trend === 'down' ? 'text-green-600' : 
                      activeDateData.trend === 'up' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {activeDateData.message}
                    </Text>
                  </View>

                  <Pressable 
                    className="w-full bg-[#0A0060] py-4 flex-row justify-center items-center rounded-xl shadow-md mb-4"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      const target = selectedDest ? selectedDest.routeId : 'ALL';
                      router.push(`/results/${target}?origin=${origin}`);
                    }}
                  >
                    <Plane color="white" size={18} />
                    <Text className="text-white font-black text-sm ml-2 uppercase tracking-widest">
                      Search {selectedDest ? `${selectedDest.name} Flights` : 'All Flights'}
                    </Text>
                  </Pressable>
                </>
              )}

              <Pressable 
                className="bg-white border-2 border-[#0A0060] py-4 flex-row justify-center items-center shadow-sm"
                style={{ borderRadius: 12 }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/explore/price-alert');
                }}
              >
                <Bell color="#0A0060" size={20} />
                <Text className="text-[#0A0060] font-black text-sm ml-2 uppercase tracking-widest">Set Price Alert</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      {/* Filter Sheet */}
      <ExploreFilterSheet 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)} 
        onApply={handleApplyFilter}
      />

      {/* Home Airport Live Search Modal */}
      <Modal visible={airportModalVisible} transparent animationType="slide">
        <SafeAreaView className="flex-1 bg-white">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-xl font-black text-[#0A0060]">Select Home Airport</Text>
            <Pressable 
              onPress={() => {
                setAirportModalVisible(false);
                setAirportSearchQuery('');
                setAirportResults([]);
              }} 
              className="p-2 bg-gray-100 rounded-full"
            >
              <X size={20} color="#0A0060" />
            </Pressable>
          </View>

          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">
              <Search size={18} color="#6b7280" />
              <TextInput
                placeholder="Type city or airport (e.g. Accra, London, Atlanta)..."
                value={airportSearchQuery}
                onChangeText={setAirportSearchQuery}
                autoFocus
                className="flex-1 ml-3 font-semibold text-gray-900 text-base"
                placeholderTextColor="#9ca3af"
              />
              {isSearchingAirports && <ActivityIndicator size="small" color="#0A0060" />}
            </View>
          </View>

          <ScrollView className="flex-1 px-4 py-2" keyboardShouldPersistTaps="handled">
            {airportSearchQuery.length < 2 ? (
              <View className="py-12 items-center">
                <Plane size={36} color="#9ca3af" />
                <Text className="text-gray-500 font-semibold text-sm mt-3">Type at least 2 characters to search global airports live from Duffel API</Text>
              </View>
            ) : airportResults.length === 0 && !isSearchingAirports ? (
              <View className="py-12 items-center">
                <Text className="text-gray-500 font-bold text-base">No airports found</Text>
              </View>
            ) : (
              airportResults.map((item) => (
                <Pressable
                  key={item.id || item.iataCode}
                  onPress={() => handleSelectOrigin(item)}
                  className="py-4 border-b border-gray-100 flex-row justify-between items-center"
                >
                  <View className="flex-1 mr-4">
                    <Text className="font-black text-gray-900 text-base">{item.cityName || item.name} ({item.iataCode})</Text>
                    <Text className="text-xs text-gray-500 font-semibold">{item.name} · {item.countryName}</Text>
                  </View>
                  <View className="bg-[#0A0060]/10 px-3 py-1 rounded-full">
                    <Text className="font-black text-[#0A0060] text-xs">{item.iataCode}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
