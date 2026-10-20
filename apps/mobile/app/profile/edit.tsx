import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setFirstName(user.user_metadata?.first_name || '');
        setLastName(user.user_metadata?.last_name || '');
        setEmail(user.email || '');
        setPhone(user.user_metadata?.phone || '');
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
    });
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'First name cannot be empty.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl,
      }
    });

    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Saved', 'Your profile has been updated.');
      router.back();
    }
  };

  const initial = firstName?.charAt(0)?.toUpperCase() || 'D';

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <Pressable onPress={pickImage} className="items-center mb-8">
          <View className="relative">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={{ width: 96, height: 96, borderRadius: 8 }} />
            ) : (
              <View className="w-24 h-24 bg-[#0A0060] items-center justify-center" style={{ borderRadius: 8 }}>
                <Text className="text-white text-4xl font-black">{initial}</Text>
              </View>
            )}
            <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#F4740D] items-center justify-center" style={{ borderRadius: 4 }}>
              <Camera size={16} color="white" />
            </View>
          </View>
          <Text className="text-[#0A0060] font-bold text-xs uppercase tracking-widest mt-4">Change Photo</Text>
        </Pressable>

        {/* Form */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Personal Details</Text>
        <View className="bg-white border border-gray-200 mb-8" style={{ borderRadius: 8 }}>
          <View className="p-4 border-b border-gray-100">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              className="text-base font-bold text-gray-900"
            />
          </View>
          <View className="p-4 border-b border-gray-100">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              className="text-base font-bold text-gray-900"
            />
          </View>
          <View className="p-4 border-b border-gray-100">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</Text>
            <Text className="text-base font-bold text-gray-400">{email}</Text>
          </View>
          <View className="p-4">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+233 55 205 4174"
              keyboardType="phone-pad"
              className="text-base font-bold text-gray-900"
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Save */}
      <View className="p-6 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className={`items-center justify-center w-full ${saving ? 'bg-gray-400' : 'bg-[#0A0060]'}`}
          style={{ height: 56, borderRadius: 4 }}
        >
          <Text className="text-white font-black text-sm tracking-widest uppercase">
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
