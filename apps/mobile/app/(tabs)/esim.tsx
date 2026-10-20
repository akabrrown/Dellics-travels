import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Skeleton } from '../../src/components/Skeleton';
import { useRouter } from 'expo-router';
import { ChevronLeft, Smartphone, Globe, Signal, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { api } from '../../src/lib/api';
import { supabase } from '../../src/lib/supabase';
import { AnimatedButton } from '../../src/components/AnimatedButton';

export default function EsimStoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
  const [region, setRegion] = useState('global'); // 'local', 'regional', 'global'

  useEffect(() => {
    fetchPackages();
  }, [region]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/esim/packages?region=${region}`);
      setPackages(res.data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load eSIM packages');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      Alert.alert('Sign in required', 'Please sign in to purchase an eSIM', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/auth/login') }
      ]);
      return;
    }

    try {
      const res = await api.post('/esim/order', { packageId: pkg.id });
      // Go to checkout flow
      router.push(`/checkout/${res.data.id}`);
    } catch (err: any) {
      Alert.alert('Error', 'Could not initiate purchase');
    }
  };

  const regions = [
    { id: 'local', title: 'Local' },
    { id: 'regional', title: 'Regional' },
    { id: 'global', title: 'Global' }
  ];

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-gray-200 bg-white">
        <Text className="text-xl font-black text-[#0A0060] uppercase tracking-widest">eSIM Store</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        
        {/* Destination-Matched Cross-Sell Banner */}
        <View className="bg-[#EAF2FF] p-5 mb-8 border border-[#0A0060]/20 flex-row items-center" style={{ borderRadius: 8 }}>
          <View className="bg-[#0A0060] w-12 h-12 rounded-full items-center justify-center mr-4">
            <MapPin color="white" size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-[#0A0060] font-black text-sm mb-1 uppercase tracking-wide">Traveling to Dubai soon?</Text>
            <Text className="text-gray-600 text-xs">Get a UAE data plan now and connect instantly when you land.</Text>
          </View>
        </View>

        {/* Region Selector */}
        <View className="flex-row mb-6 bg-gray-100 p-1 rounded-lg border border-gray-200">
          {regions.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setRegion(r.id);
              }}
              className={`flex-1 py-3 items-center rounded-md ${region === r.id ? 'bg-white shadow-sm border border-gray-200' : ''}`}
            >
              <Text className={`font-bold text-xs uppercase tracking-wider ${region === r.id ? 'text-[#0A0060]' : 'text-gray-500'}`}>
                {r.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Packages List */}
        {loading ? (
          <View style={{ paddingTop: 24 }}>
            {[1, 2, 3].map(i => (
              <View key={i} style={{ backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Skeleton width={100} height={18} style={{ marginBottom: 8 }} />
                  <Skeleton width={140} height={12} style={{ marginBottom: 4 }} />
                  <Skeleton width={80} height={12} />
                </View>
                <Skeleton width={60} height={36} borderRadius={4} />
              </View>
            ))}
          </View>
        ) : (
          <View className="gap-y-4">
            {packages.map((pkg, index) => (
              <View key={index} className="bg-white p-5 rounded-lg border border-gray-200 flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-black text-gray-900 mb-1">{pkg.data}</Text>
                  <View className="flex-row items-center mb-1">
                    <Globe size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 font-medium text-xs ml-1">{region.charAt(0).toUpperCase() + region.slice(1)} Coverage</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Signal size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 font-medium text-xs ml-1">Valid for {pkg.validity}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-black text-[#F4740D] mb-3">${pkg.price.toFixed(2)}</Text>
                  <Pressable 
                    onPress={() => handlePurchase(pkg)}
                    className="bg-[#0A0060] px-4 py-2 rounded-md"
                  >
                    <Text className="text-white font-bold text-xs uppercase tracking-wider">Buy Now</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
