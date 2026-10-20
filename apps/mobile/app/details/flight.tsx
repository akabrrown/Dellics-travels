import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Plane, Clock, Briefcase, Info, PlaneTakeoff, PlaneLanding, ChevronRight } from 'lucide-react-native';

export default function FlightDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // Using some mock data for the visual structure
  const flight = {
    airline: 'Emirates',
    flightNumber: 'EK 788',
    departure: { airport: 'ACC', time: '18:50', date: 'Aug 15', city: 'Accra' },
    arrival: { airport: 'DXB', time: '06:30', date: 'Aug 16', city: 'Dubai' },
    duration: '7h 40m',
    price: 850,
    baggage: '2x 23kg Checked, 1x 7kg Cabin',
    cabin: 'Economy'
  };

  const handleBook = () => {
    router.push({
      pathname: '/checkout/review',
      params: { type: 'FLIGHT', price: flight.price, title: `${flight.departure.city} to ${flight.arrival.city}` }
    });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
          <ChevronLeft color="#374151" size={24} />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 ml-2">Flight Details</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Itinerary */}
        <View className="p-6">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                <Text className="text-red-700 font-bold text-xs">EK</Text>
              </View>
              <View>
                <Text className="text-gray-900 font-bold">{flight.airline}</Text>
                <Text className="text-gray-500 text-xs">{flight.flightNumber} • {flight.cabin}</Text>
              </View>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-gray-600 text-xs font-medium">{flight.duration}</Text>
            </View>
          </View>

          {/* Timeline */}
          <View className="pl-2 relative">
            <View className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-gray-200" />
            
            <View className="flex-row mb-8 relative">
              <View className="w-2 h-2 rounded-full bg-[#0A0060] absolute -left-[3px] top-1.5" />
              <View className="ml-8 flex-1">
                <Text className="text-lg font-black text-gray-900">{flight.departure.time}</Text>
                <Text className="text-gray-500 text-sm mb-1">{flight.departure.date}</Text>
                <Text className="text-gray-900 font-medium">{flight.departure.city} ({flight.departure.airport})</Text>
              </View>
            </View>

            <View className="flex-row relative">
              <View className="w-2 h-2 rounded-full bg-[#F4740D] absolute -left-[3px] top-1.5" />
              <View className="ml-8 flex-1">
                <Text className="text-lg font-black text-gray-900">{flight.arrival.time}</Text>
                <Text className="text-gray-500 text-sm mb-1">{flight.arrival.date}</Text>
                <Text className="text-gray-900 font-medium">{flight.arrival.city} ({flight.arrival.airport})</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="h-2 bg-gray-50" />

        {/* Allowances */}
        <View className="p-6">
          <Text className="text-sm font-bold text-gray-900 mb-4">Baggage & Amenities</Text>
          
          <View className="flex-row items-center mb-4">
            <Briefcase size={20} color="#6B7280" />
            <Text className="ml-3 text-gray-700">{flight.baggage}</Text>
          </View>
          
          <View className="flex-row items-center mb-4">
            <Info size={20} color="#6B7280" />
            <Text className="ml-3 text-gray-700">Meals included</Text>
          </View>

          <View className="flex-row items-center">
            <Info size={20} color="#6B7280" />
            <Text className="ml-3 text-gray-700">In-flight Wi-Fi available</Text>
          </View>
        </View>

        <View className="h-2 bg-gray-50" />

        {/* Fare Rules */}
        <View className="p-6 mb-20">
          <Text className="text-sm font-bold text-gray-900 mb-4">Fare Rules</Text>
          <Text className="text-gray-600 text-sm leading-6 mb-2">• Non-refundable</Text>
          <Text className="text-gray-600 text-sm leading-6">• Changes permitted with fee</Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="p-6 bg-white border-t border-gray-100 flex-row justify-between items-center pb-8">
        <View>
          <Text className="text-gray-500 text-xs mb-1">Total price</Text>
          <Text className="text-2xl font-black text-gray-900">${flight.price}</Text>
        </View>
        <Pressable 
          onPress={handleBook}
          className="bg-[#0A0060] px-8 py-4 rounded-xl flex-row items-center"
        >
          <Text className="text-white font-bold mr-2">Book Flight</Text>
          <ChevronRight color="white" size={16} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
