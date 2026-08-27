import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (interest: string, length: string) => void;
}

export function ExploreFilterSheet({ visible, onClose, onApply }: FilterSheetProps) {
  const [activeInterest, setActiveInterest] = useState('All');
  const [activeLength, setActiveLength] = useState('Weekend');

  const interests = ['All', 'Beach', 'City', 'Nature', 'Culture'];
  const lengths = ['Weekend', '1 Week', '2 Weeks', '1 Month+'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        
        <View className="bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <SafeAreaView edges={['bottom']}>
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-8">
                <Text className="text-xl font-black text-[#0A0060]">Filters</Text>
                <Pressable onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                  <X size={20} color="#0A0060" />
                </Pressable>
              </View>

              <Text className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Interests</Text>
              <View className="flex-row flex-wrap mb-8">
                {interests.map(item => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setActiveInterest(item);
                    }}
                    className={`px-4 py-2 mr-2 mb-3 rounded-full border ${activeInterest === item ? 'bg-[#0A0060] border-[#0A0060]' : 'bg-white border-gray-200'}`}
                  >
                    <Text className={`font-bold text-sm ${activeInterest === item ? 'text-white' : 'text-gray-600'}`}>
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Trip Length</Text>
              <View className="flex-row flex-wrap mb-10">
                {lengths.map(item => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setActiveLength(item);
                    }}
                    className={`px-4 py-2 mr-2 mb-3 rounded-full border ${activeLength === item ? 'bg-[#0A0060] border-[#0A0060]' : 'bg-white border-gray-200'}`}
                  >
                    <Text className={`font-bold text-sm ${activeLength === item ? 'text-white' : 'text-gray-600'}`}>
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onApply(activeInterest, activeLength);
                  onClose();
                }}
                className="w-full bg-[#F4740D] py-4 items-center rounded-xl shadow-md"
              >
                <Text className="text-white font-black text-base uppercase tracking-widest">Apply Filters</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
