import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { X, Calendar as CalendarIcon, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSearchStore } from '../../src/store/useSearchStore';

export default function DatePickerModal() {
  const params = useLocalSearchParams<{ target?: string, mode?: string }>();
  
  // Default to 'checkin' if no target is provided, so the tab highlights correctly
  const targetParam = params?.target || 'checkin';
  const isHotelMode = params?.mode === 'HOTELS';
  
  const { startDateIso, endDateIso, setRangeDates } = useSearchStore();

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const CELL_SIZE = (SCREEN_WIDTH - 32) / 7; // 32 is px-4 padding

  const [startDate, setStartDate] = useState<Date | null>(() => startDateIso ? new Date(startDateIso) : null);
  const [endDate, setEndDate] = useState<Date | null>(() => endDateIso ? new Date(endDateIso) : null);
  const [selectingTarget, setSelectingTarget] = useState<'checkin' | 'checkout' | 'range'>(
    targetParam as 'checkin' | 'checkout' | 'range'
  );

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
  };

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const months = useMemo(() => {
    const result = [];
    const current = new Date(today);
    current.setDate(1);

    for (let i = 0; i < 12; i++) {
      const year = current.getFullYear();
      const monthIndex = current.getMonth();
      const monthName = MONTH_NAMES[monthIndex];
      
      const firstDay = new Date(year, monthIndex, 1);
      const startingEmptyCells = firstDay.getDay();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      result.push({
        id: `${year}-${monthIndex}`,
        year,
        monthIndex,
        monthName: `${monthName} ${year}`,
        startingEmptyCells,
        daysInMonth
      });

      current.setMonth(current.getMonth() + 1);
    }
    return result;
  }, [today]);

  const handleDayPress = (date: Date) => {
    if (date < today) return; // Prevent past dates
    Haptics.selectionAsync();

    if (selectingTarget === 'checkin') {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(null);
      }
      setSelectingTarget('checkout'); // Auto advance to checkout date selection
    } else if (selectingTarget === 'checkout') {
      if (startDate && date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    } else {
      // General range selection
      if (!startDate || (startDate && endDate)) {
        setStartDate(date);
        setEndDate(null);
      } else if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    }
  };

  const renderMonth = (monthData: any) => {
    const cells = [];

    // Empty cells
    for (let i = 0; i < monthData.startingEmptyCells; i++) {
      cells.push(<View key={`empty-${monthData.monthIndex}-${i}`} style={{ width: CELL_SIZE, height: CELL_SIZE }} />);
    }

    // Days
    for (let i = 1; i <= monthData.daysInMonth; i++) {
      const currentDate = new Date(monthData.year, monthData.monthIndex, i);
      const isPast = currentDate < today;
      
      const isStart = isSameDay(startDate, currentDate);
      const isEnd = isSameDay(endDate, currentDate);
      const isSelected = isStart || isEnd;
      
      let isInRange = false;
      if (startDate && endDate) {
        // Normalize for accurate range checking regardless of time
        const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        isInRange = currentDate > startMidnight && currentDate < endMidnight;
      }

      let bgClass = "bg-transparent";
      let textClass = isPast ? "text-gray-300" : "text-gray-900";

      if (isSelected) {
        bgClass = "bg-[#0A0060]";
        textClass = "text-white font-bold";
      } else if (isInRange) {
        bgClass = "";
        textClass = "text-[#0A0060] font-bold";
      }

      const formattedLabel = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const a11yStatus = isStart ? 'Selected departure date' : isEnd ? 'Selected return date' : isInRange ? 'In selected date range' : 'Available date';

      cells.push(
        <View key={`${monthData.monthIndex}-${i}`} style={{ width: CELL_SIZE, height: CELL_SIZE }} className="p-1">
          <Pressable 
            onPress={() => !isPast && handleDayPress(currentDate)}
            accessibilityRole="button"
            accessibilityLabel={`${formattedLabel}, ${a11yStatus}`}
            accessibilityState={{ selected: !!isSelected, disabled: isPast }}
            className={`flex-1 items-center justify-center rounded-full ${bgClass}`}
            style={isInRange && !isSelected ? { backgroundColor: 'rgba(10, 0, 96, 0.1)' } : undefined}
          >
            <Text className={textClass}>{i}</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View key={`${monthData.year}-${monthData.monthIndex}`} className="mb-8">
        <Text className="text-[#0A0060] font-black text-lg ml-2 mb-4">{monthData.monthName}</Text>
        <View className="flex-row flex-wrap">
          {cells}
        </View>
      </View>
    );
  };

  const handleApply = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (startDate && endDate) {
      const startStr = `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}`;
      const endStr = `${MONTHS[endDate.getMonth()]} ${endDate.getDate()}`;
      setRangeDates(startStr, endStr, startDate.toISOString(), endDate.toISOString());
    } else if (startDate) {
      const startStr = `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}`;
      setRangeDates(startStr, '', startDate.toISOString(), undefined);
    } else {
      setRangeDates('Select Dates', '');
    }
    
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const formatDateLabel = (d: Date | null) => {
    if (!d) return 'Select date';
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <Text className="text-xl font-black text-[#0A0060]">{isHotelMode ? 'Select Dates' : 'Select Travel Dates'}</Text>
        <Pressable 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          className="p-2 bg-gray-100 rounded-full"
        >
          <X size={20} color="#374151" />
        </Pressable>
      </View>

      {/* Target Selector Tabs (Departure / Check-in & Return / Check-out) */}
      <View className="flex-row px-6 py-3 bg-gray-50 border-b border-gray-200">
        <Pressable 
          onPress={() => { Haptics.selectionAsync(); setSelectingTarget('checkin'); }}
          className={`flex-1 p-3 rounded-lg mr-2 border ${
            selectingTarget === 'checkin' ? 'bg-white border-[#0A0060] shadow-sm' : 'bg-gray-100 border-gray-200'
          }`}
        >
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Departure / Check-in</Text>
          <Text className={`font-black text-sm mt-0.5 ${startDate ? 'text-[#0A0060]' : 'text-gray-400'}`}>
            {formatDateLabel(startDate)}
          </Text>
        </Pressable>

        <Pressable 
          onPress={() => { Haptics.selectionAsync(); setSelectingTarget('checkout'); }}
          className={`flex-1 p-3 rounded-lg border ${
            selectingTarget === 'checkout' ? 'bg-white border-[#0A0060] shadow-sm' : 'bg-gray-100 border-gray-200'
          }`}
        >
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Return / Check-out</Text>
          <Text className={`font-black text-sm mt-0.5 ${endDate ? 'text-[#0A0060]' : 'text-gray-400'}`}>
            {formatDateLabel(endDate)}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-4 pt-6">
        {/* Days of Week Header */}
        <View className="flex-row mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <View key={i} style={{ width: CELL_SIZE }} className="items-center">
              <Text className="text-xs font-bold text-gray-400">{d}</Text>
            </View>
          ))}
        </View>

        {/* Dynamic Calendar Grids Lazily Loaded */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {months.map((item) => renderMonth(item))}
        </ScrollView>
      </View>

      {/* Sticky Bottom Bar */}
      <View className="p-6 border-t border-gray-100 bg-white" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 4 }}>
        <Pressable 
          onPress={handleApply}
          className="bg-[#F4740D] flex-row items-center justify-center rounded-lg h-14"
        >
          <CalendarIcon color="white" size={20} className="mr-2" />
          <Text className="text-white font-black text-lg">Save & Apply Dates</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
