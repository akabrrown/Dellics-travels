import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export function GlassCard({ children, intensity = 50, tint = 'light', style, ...props }: GlassCardProps) {
  return (
    <View className="rounded-3xl overflow-hidden border border-white/20" style={style} {...props}>
      <BlurView intensity={intensity} tint={tint} style={{ padding: 20, backgroundColor: 'rgba(255,255,255,0.3)' }}>
        {children}
      </BlurView>
    </View>
  );
}
