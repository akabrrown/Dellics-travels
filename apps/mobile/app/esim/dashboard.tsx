import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { EsimDashboardSkeleton } from '../../src/components/Skeleton';
import { useRouter } from 'expo-router';
import { ChevronLeft, Smartphone, QrCode } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../src/lib/api';

export default function EsimDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/esim/orders');
      setOrders(res.data);
    } catch (err) {
      console.log('Error fetching eSIM orders', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} className="mr-4 p-2 -ml-2 rounded-full border border-gray-200">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">My eSIMs</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {loading ? (
          <EsimDashboardSkeleton />
        ) : orders.length === 0 ? (
          <View className="items-center mt-12 bg-white p-6 rounded-lg border border-gray-200">
            <Smartphone size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
            <Text className="text-lg font-bold text-gray-900 mb-2">No eSIMs yet</Text>
            <Text className="text-center text-gray-500 mb-6">Stay connected anywhere with our global data plans.</Text>
            <Pressable 
              onPress={() => router.push('/esim')}
              className="bg-[#0A0060] px-6 py-3 rounded-md"
            >
              <Text className="text-white font-bold text-sm uppercase tracking-wider">Visit Store</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-y-4">
            {orders.map((order, index) => (
              <View key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <View className="p-4 border-b border-gray-200 bg-gray-50 flex-row justify-between items-center">
                  <View>
                    <Text className="font-bold text-gray-900">{order.esim_plan?.country_or_region} Data Plan</Text>
                    <Text className="text-xs text-gray-500 mt-1">{order.esim_plan?.data_gb} GB • {order.esim_plan?.validity_days} Days</Text>
                  </View>
                  <View className={`px-2 py-1 rounded-md ${order.status === 'PROVISIONED' || order.status === 'ACTIVE' ? 'bg-[#1E7A34]' : 'bg-gray-300'}`}>
                    <Text className="text-white text-[10px] font-bold uppercase">{order.status}</Text>
                  </View>
                </View>

                {order.qr_code_url ? (
                  <View className="p-6 items-center">
                    <Text className="text-sm font-bold text-[#0A0060] mb-4">Scan QR code on device to activate</Text>
                    <Image source={{ uri: order.qr_code_url }} style={{ width: 200, height: 200 }} />
                    <Text className="text-xs text-gray-500 mt-4 text-center">ICCID: {order.iccid}</Text>
                  </View>
                ) : (
                  <View className="p-6 items-center">
                    <ActivityIndicator size="small" color="#0A0060" />
                    <Text className="text-xs text-gray-500 mt-2">Provisioning your eSIM...</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

