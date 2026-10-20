import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, User, ChevronRight, Trash2, Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface TravelerProfile {
  id: string;
  name: string;
  passportNumber: string;
  nationality: string;
  expiry: string;
}

const INITIAL_TRAVELERS: TravelerProfile[] = [];

export default function PassportScreen() {
  const router = useRouter();
  const [travelers, setTravelers] = useState<TravelerProfile[]>(INITIAL_TRAVELERS);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPassport, setFormPassport] = useState('');
  const [formNationality, setFormNationality] = useState('');
  const [formExpiry, setFormExpiry] = useState('');

  const handleAdd = () => {
    if (!formName.trim() || !formPassport.trim()) {
      Alert.alert('Required', 'Name and passport number are required.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newTraveler: TravelerProfile = {
      id: Date.now().toString(),
      name: formName.trim(),
      passportNumber: formPassport.trim().toUpperCase(),
      nationality: formNationality.trim() || 'Ghana',
      expiry: formExpiry.trim(),
    };

    setTravelers([...travelers, newTraveler]);
    setFormName('');
    setFormPassport('');
    setFormNationality('');
    setFormExpiry('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Remove Traveler', 'This will permanently delete this traveler profile.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setTravelers(travelers.filter(t => t.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Passport & ID</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center mb-6">
          <Shield size={20} color="#0A0060" />
          <Text className="text-gray-500 text-xs font-semibold ml-2 flex-1">
            All passport data is encrypted at rest. We only use it to pre-fill booking forms.
          </Text>
        </View>

        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Saved Travelers</Text>

        {travelers.length === 0 && !showForm && (
          <View className="bg-white border border-gray-200 p-8 items-center" style={{ borderRadius: 8 }}>
            <User size={32} color="#D1D5DB" />
            <Text className="text-gray-500 font-bold text-sm mt-4 text-center">No saved travelers yet.</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">Add a traveler to speed up future bookings.</Text>
          </View>
        )}

        {travelers.length > 0 && (
          <View className="bg-white border border-gray-200 mb-6" style={{ borderRadius: 8 }}>
            {travelers.map((t, index) => (
              <Pressable
                key={t.id}
                className={`flex-row items-center p-4 ${index !== travelers.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="w-10 h-10 bg-[#0A0060]/10 items-center justify-center mr-4" style={{ borderRadius: 4 }}>
                  <Text className="text-[#0A0060] font-black text-sm">{t.name.charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 text-sm">{t.name}</Text>
                  <Text className="text-gray-500 text-xs font-semibold mt-0.5">
                    {t.nationality} • {t.passportNumber} • Exp {t.expiry || 'N/A'}
                  </Text>
                </View>
                <Pressable onPress={() => handleDelete(t.id)} className="p-2 -mr-2">
                  <Trash2 size={18} color="#DC2626" />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}

        {/* Add Form */}
        {showForm && (
          <View className="bg-white border border-[#0A0060] mb-6" style={{ borderRadius: 8 }}>
            <View className="p-4 border-b border-gray-100">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</Text>
              <TextInput value={formName} onChangeText={setFormName} placeholder="As on passport" className="text-base font-bold text-gray-900" />
            </View>
            <View className="p-4 border-b border-gray-100">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Passport Number</Text>
              <TextInput value={formPassport} onChangeText={setFormPassport} placeholder="G12345678" autoCapitalize="characters" className="text-base font-bold text-gray-900" />
            </View>
            <View className="flex-row border-b border-gray-100">
              <View className="flex-1 p-4 border-r border-gray-100">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nationality</Text>
                <TextInput value={formNationality} onChangeText={setFormNationality} placeholder="Ghana" className="text-base font-bold text-gray-900" />
              </View>
              <View className="flex-1 p-4">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expiry</Text>
                <TextInput value={formExpiry} onChangeText={setFormExpiry} placeholder="MM/YYYY" keyboardType="number-pad" className="text-base font-bold text-gray-900" />
              </View>
            </View>
            <View className="flex-row p-4">
              <Pressable onPress={() => setShowForm(false)} className="flex-1 items-center justify-center border border-gray-200 mr-2" style={{ height: 44, borderRadius: 4 }}>
                <Text className="text-gray-700 font-black text-xs uppercase tracking-widest">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleAdd} className="flex-1 items-center justify-center bg-[#0A0060]" style={{ height: 44, borderRadius: 4 }}>
                <Text className="text-white font-black text-xs uppercase tracking-widest">Save</Text>
              </Pressable>
            </View>
          </View>
        )}

        {!showForm && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowForm(true);
            }}
            className="flex-row items-center justify-center bg-white border border-dashed border-gray-300 mt-6"
            style={{ height: 56, borderRadius: 8 }}
          >
            <Plus size={20} color="#0A0060" />
            <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest ml-2">Add Traveler</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
