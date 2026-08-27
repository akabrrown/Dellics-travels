import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { WifiOff } from 'lucide-react-native';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false && state.isInternetReachable === false;
      setIsOffline(offline);

      Animated.spring(slideAnim, {
        toValue: offline ? 0 : -100,
        useNativeDriver: true,
        bounciness: 12,
      }).start();
    });

    return () => unsubscribe();
  }, [slideAnim]);

  if (!isOffline) return null;

  return (
    <Animated.View 
      style={{ transform: [{ translateY: slideAnim }], position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}
    >
      <SafeAreaView style={{ backgroundColor: '#EF4444' }}>
        <View className="flex-row items-center justify-center py-3 px-4 bg-red-500">
          <WifiOff size={16} color="white" />
          <Text className="text-white font-bold text-sm ml-2">No Internet Connection</Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
