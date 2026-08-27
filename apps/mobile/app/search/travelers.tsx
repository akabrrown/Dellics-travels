import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Minus, Plus, Users, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSearchStore } from '../../src/store/useSearchStore';

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  min: number;
  onChange: (newValue: number) => void;
}

function TravelerCounter({ title, subtitle, value, min, onChange }: CounterProps) {
  const handleDecrement = () => {
    if (value > min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value - 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(value + 1);
  };

  return (
    <View className="flex-row items-center justify-between py-6 border-b border-gray-100">
      <View>
        <Text className="text-lg font-bold text-[#0A0060] mb-1">{title}</Text>
        <Text className="text-sm font-medium text-gray-400">{subtitle}</Text>
      </View>
      <View className="flex-row items-center">
        <Pressable 
          onPress={handleDecrement}
          className={`w-10 h-10 rounded-full border items-center justify-center ${value <= min ? 'border-gray-200 bg-gray-50' : 'border-[#F4740D] bg-white'}`}
        >
          <Minus size={18} color={value <= min ? '#D1D5DB' : '#F4740D'} />
        </Pressable>
        <Text className="w-12 text-center text-xl font-black text-[#0A0060]">{value}</Text>
        <Pressable 
          onPress={handleIncrement}
          className="w-10 h-10 rounded-full border border-[#F4740D] items-center justify-center"
          style={{ backgroundColor: 'rgba(244, 116, 13, 0.1)' }}
        >
          <Plus size={18} color="#F4740D" />
        </Pressable>
      </View>
    </View>
  );
}

export default function TravelersModal() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const isHotelMode = mode === 'HOTELS';
  
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('Economy');
  
  const setTravelers = useSearchStore(state => state.setTravelers);
  const setStoreCabinClass = useSearchStore(state => state.setCabinClass);
  const setRoomsAndGuests = useSearchStore(state => state.setRoomsAndGuests);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <Text className="text-xl font-black text-[#0A0060]">
          {isHotelMode ? 'Rooms & Guests' : 'Travelers & Cabin'}
        </Text>
        <Pressable 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          className="p-2 bg-gray-100 rounded-full"
        >
          <X size={20} color="#374151" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        <View className="py-2">
          {isHotelMode && (
            <TravelerCounter 
              title="Rooms" 
              subtitle="Number of rooms" 
              value={rooms} 
              min={1} 
              onChange={setRooms} 
            />
          )}
          <TravelerCounter 
            title="Adults" 
            subtitle="Age 12+" 
            value={adults} 
            min={1} 
            onChange={setAdults} 
          />
          <TravelerCounter 
            title="Children" 
            subtitle="Ages 2-11" 
            value={children} 
            min={0} 
            onChange={setChildren} 
          />
          {!isHotelMode && (
            <TravelerCounter 
              title="Infants" 
              subtitle="Under 2, on lap" 
              value={infants} 
              min={0} 
              onChange={setInfants} 
            />
          )}
        </View>

        {!isHotelMode && (
          <View className="mt-8 mb-6">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Cabin Class</Text>
            <View className="space-y-3">
              {[
                { id: 'economy', label: 'Economy' },
                { id: 'premium', label: 'Premium Economy' },
                { id: 'business', label: 'Business' },
                { id: 'first', label: 'First Class' },
              ].map((cls) => (
                <Pressable 
                  key={cls.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setCabinClass(cls.label);
                  }}
                  className={`flex-row items-center justify-between p-4 rounded-xl border ${cabinClass === cls.label ? 'border-[#0A0060]' : 'border-gray-200 bg-white'}`}
                  style={cabinClass === cls.label ? { backgroundColor: 'rgba(10, 0, 96, 0.05)' } : undefined}
                >
                  <Text className={`text-base font-bold ${cabinClass === cls.label ? 'text-[#0A0060]' : 'text-gray-700'}`}>{cls.label}</Text>
                  {cabinClass === cls.label && <Check size={20} color="#0A0060" />}
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="p-6 border-t border-gray-100 bg-white" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 4 }}>
        <Pressable 
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Format strings based on counts
            const total = adults + children + infants;
            const travelerString = total === 1 ? '1 Adult' : `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`;
            const roomString = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults + children} Guest${adults + children > 1 ? 's' : ''}`;
            
            setTravelers(travelerString);
            setRoomsAndGuests(roomString);
            setStoreCabinClass(cabinClass);
            
            if (router.canGoBack()) { router.back(); } else { router.replace('/'); }
          }}
          className="bg-[#F4740D] flex-row items-center justify-center rounded-lg h-14"
        >
          <Users color="white" size={20} className="mr-2" />
          <Text className="text-white font-black text-lg">Apply Selection</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
