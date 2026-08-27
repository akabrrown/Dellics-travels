import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, StyleProp } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 40 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Skeleton width={80} height={80} borderRadius={40} />
        <Skeleton width={140} height={18} style={{ marginTop: 16 }} />
        <Skeleton width={200} height={14} style={{ marginTop: 8 }} />
      </View>
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
          <Skeleton width={24} height={24} borderRadius={4} />
          <Skeleton width={160} height={14} style={{ marginLeft: 16 }} />
        </View>
      ))}
    </View>
  );
}

export function TripsSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#fff' }}>
        <Skeleton width={100} height={22} />
      </View>
      <View style={{ padding: 24 }}>
        <Skeleton width={90} height={16} style={{ marginBottom: 16 }} />
        <View style={{ backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 }}>
          <Skeleton width={180} height={18} style={{ marginBottom: 8 }} />
          <Skeleton width={140} height={12} style={{ marginBottom: 16 }} />
          <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Skeleton width={32} height={32} borderRadius={16} />
            <View style={{ marginLeft: 12 }}>
              <Skeleton width={150} height={14} style={{ marginBottom: 4 }} />
              <Skeleton width={120} height={11} />
            </View>
          </View>
        </View>
        <Skeleton width={80} height={16} style={{ marginTop: 32, marginBottom: 16 }} />
        <View style={{ backgroundColor: '#fff', padding: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 }}>
          <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
          <Skeleton width={140} height={11} />
        </View>
      </View>
    </View>
  );
}

export function EsimSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#fff' }}>
        <Skeleton width={100} height={22} />
      </View>
      <View style={{ padding: 24 }}>
        <Skeleton width="100%" height={120} borderRadius={8} style={{ marginBottom: 16 }} />
        <Skeleton width={140} height={16} style={{ marginBottom: 12 }} />
        {[1, 2, 3].map(i => (
          <View key={i} style={{ backgroundColor: '#fff', padding: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Skeleton width={40} height={28} borderRadius={4} />
              <View style={{ marginLeft: 12 }}>
                <Skeleton width={120} height={14} style={{ marginBottom: 4 }} />
                <Skeleton width={80} height={11} />
              </View>
            </View>
            <Skeleton width="100%" height={36} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function SettingsSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 24 }}>
      <Skeleton width={100} height={22} style={{ marginBottom: 24 }} />
      {[1, 2, 3, 4, 5, 6].map(i => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Skeleton width={20} height={20} borderRadius={4} />
            <Skeleton width={140} height={14} style={{ marginLeft: 12 }} />
          </View>
          <Skeleton width={44} height={26} borderRadius={13} />
        </View>
      ))}
    </View>
  );
}

export function CheckoutSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 24, paddingTop: 24 }}>
      <Skeleton width={120} height={22} style={{ marginBottom: 24 }} />
      <View style={{ backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 16 }}>
        <Skeleton width={160} height={16} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} />
      </View>
      <View style={{ backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 16 }}>
        <Skeleton width={100} height={16} style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Skeleton width={100} height={14} />
          <Skeleton width={60} height={14} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Skeleton width={80} height={14} />
          <Skeleton width={50} height={14} />
        </View>
        <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Skeleton width={60} height={16} />
          <Skeleton width={80} height={16} />
        </View>
      </View>
      <Skeleton width="100%" height={52} borderRadius={4} style={{ marginTop: 16 }} />
    </View>
  );
}

export function EsimDashboardSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 24, paddingTop: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Skeleton width={140} height={140} borderRadius={70} style={{ marginBottom: 16 }} />
        <Skeleton width={100} height={16} style={{ marginBottom: 6 }} />
        <Skeleton width={60} height={12} />
      </View>
      <View style={{ backgroundColor: '#fff', padding: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Skeleton width={80} height={14} />
          <Skeleton width={60} height={14} />
        </View>
        <Skeleton width="100%" height={8} borderRadius={4} />
      </View>
      {[1, 2].map(i => (
        <View key={i} style={{ backgroundColor: '#fff', padding: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, marginBottom: 12 }}>
          <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
          <Skeleton width={180} height={12} />
        </View>
      ))}
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Skeleton width={48} height={48} borderRadius={24} />
    </View>
  );
}
