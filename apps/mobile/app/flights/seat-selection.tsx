import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Seat {
  id: string; // e.g. '12A'
  row: number;
  col: string; // 'A'..'F'
  type: 'standard' | 'legroom' | 'preferred' | 'occupied';
  price: number;
}

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { flightId, fare } = useLocalSearchParams<{ flightId: string; fare: string }>();
  
  const [selectedSeat, setSelectedSeat] = useState<string | null>('12B');

  // Generate 10 rows of seats (A B C | D E F)
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const columnsLeft = ['A', 'B', 'C'];
  const columnsRight = ['D', 'E', 'F'];

  const getSeatInfo = (row: number, col: string): Seat => {
    const id = `${row}${col}`;
    if ((row === 2 && col === 'B') || (row === 5 && col === 'E') || (row === 8 && col === 'A')) {
      return { id, row, col, type: 'occupied', price: 0 };
    }
    if (row <= 2) {
      return { id, row, col, type: 'preferred', price: 25 };
    }
    if (row === 5) {
      return { id, row, col, type: 'legroom', price: 35 };
    }
    return { id, row, col, type: 'standard', price: 0 };
  };

  const handleSeatPress = (seat: Seat) => {
    if (seat.type === 'occupied') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedSeat(seat.id);
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace(`/flights/${flightId || '1'}?selectedSeat=${selectedSeat}`);
  };

  const currentSeatObj = selectedSeat ? getSeatInfo(parseInt(selectedSeat), selectedSeat.slice(-1)) : null;

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <SafeAreaView edges={['top']} className="bg-[#0A0060]" />
      
      {/* Header */}
      <View className="bg-[#0A0060] px-4 py-4 flex-row items-center border-b border-[#0A0060]">
        <Pressable 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
          className="p-2 mr-2 -ml-2"
        >
          <ChevronLeft size={24} color="#FFF" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-black text-white">Select Your Seat</Text>
          <Text className="text-sm font-semibold text-blue-200">Boeing 787 Dreamliner · Economy Cabin</Text>
        </View>
      </View>

      {/* Legend */}
      <View className="bg-white px-6 py-3 border-b border-gray-200 flex-row justify-between items-center shadow-sm">
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded bg-[#0A0060] mr-1.5" />
          <Text className="text-xs font-bold text-gray-600">Selected</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded bg-gray-100 border border-gray-300 mr-1.5" />
          <Text className="text-xs font-bold text-gray-600">Standard ($0)</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded bg-amber-100 border border-amber-300 mr-1.5" />
          <Text className="text-xs font-bold text-amber-700">Legroom (+$35)</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 rounded bg-gray-300 mr-1.5" />
          <Text className="text-xs font-bold text-gray-400">Taken</Text>
        </View>
      </View>

      <ScrollView className="flex-1 py-6 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cockpit Indicator */}
        <View className="w-full py-2 bg-gray-200 rounded-t-full items-center mb-8">
          <Text className="text-xs font-black text-gray-500 uppercase tracking-widest">Front of Aircraft</Text>
        </View>

        {/* Seat Grid */}
        {rows.map((row) => (
          <View key={row} className="flex-row items-center justify-between mb-4 px-2">
            {/* Left Side (A, B, C) */}
            <View className="flex-row space-x-2">
              {columnsLeft.map((col) => {
                const seat = getSeatInfo(row, col);
                const isSelected = selectedSeat === seat.id;
                const isOccupied = seat.type === 'occupied';
                const isLegroom = seat.type === 'legroom';
                const isPreferred = seat.type === 'preferred';

                return (
                  <Pressable
                    key={seat.id}
                    onPress={() => handleSeatPress(seat)}
                    disabled={isOccupied}
                    accessibilityRole="button"
                    accessibilityLabel={`Seat ${seat.id}, ${seat.type} ${seat.price > 0 ? `plus $${seat.price}` : 'included'}, ${isOccupied ? 'Occupied' : isSelected ? 'Selected' : 'Available'}`}
                    accessibilityState={{ selected: isSelected, disabled: isOccupied }}
                    className={`w-10 h-10 rounded-lg justify-center items-center border ${
                      isSelected
                        ? 'bg-[#0A0060] border-[#0A0060]'
                        : isOccupied
                        ? 'bg-gray-300 border-gray-300 opacity-60'
                        : isLegroom
                        ? 'bg-amber-50 border-amber-300'
                        : isPreferred
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`font-bold text-xs ${isSelected ? 'text-white' : isOccupied ? 'text-gray-500' : 'text-gray-900'}`}>
                      {seat.id}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Aisle Number */}
            <Text className="font-black text-gray-400 text-xs w-6 text-center">{row}</Text>

            {/* Right Side (D, E, F) */}
            <View className="flex-row space-x-2">
              {columnsRight.map((col) => {
                const seat = getSeatInfo(row, col);
                const isSelected = selectedSeat === seat.id;
                const isOccupied = seat.type === 'occupied';
                const isLegroom = seat.type === 'legroom';
                const isPreferred = seat.type === 'preferred';

                return (
                  <Pressable
                    key={seat.id}
                    onPress={() => handleSeatPress(seat)}
                    disabled={isOccupied}
                    accessibilityRole="button"
                    accessibilityLabel={`Seat ${seat.id}, ${seat.type} ${seat.price > 0 ? `plus $${seat.price}` : 'included'}, ${isOccupied ? 'Occupied' : isSelected ? 'Selected' : 'Available'}`}
                    accessibilityState={{ selected: isSelected, disabled: isOccupied }}
                    className={`w-10 h-10 rounded-lg justify-center items-center border ${
                      isSelected
                        ? 'bg-[#0A0060] border-[#0A0060]'
                        : isOccupied
                        ? 'bg-gray-300 border-gray-300 opacity-60'
                        : isLegroom
                        ? 'bg-amber-50 border-amber-300'
                        : isPreferred
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`font-bold text-xs ${isSelected ? 'text-white' : isOccupied ? 'text-gray-500' : 'text-gray-900'}`}>
                      {seat.id}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Sticky Confirmation Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pt-4 pb-8 flex-row justify-between items-center shadow-lg">
        <View>
          <Text className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Selected Seat</Text>
          <Text className="text-2xl font-black text-[#0A0060] leading-none">
            {selectedSeat ? `${selectedSeat} ${currentSeatObj?.price ? `(+$${currentSeatObj.price})` : '(Free)'}` : 'None'}
          </Text>
        </View>
        <Pressable 
          onPress={handleConfirm}
          className="bg-[#F4740D] h-14 px-8 items-center justify-center rounded-[8px]"
        >
          <Text className="text-white font-black text-sm uppercase tracking-widest">Confirm Seat</Text>
        </Pressable>
      </View>
    </View>
  );
}
