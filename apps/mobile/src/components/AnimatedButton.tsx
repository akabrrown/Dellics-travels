import React, { useRef } from 'react';
import { Text, Pressable, PressableProps, ActivityIndicator, Animated } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function AnimatedButton({ title, loading, variant = 'primary', style, ...props }: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, damping: 10, stiffness: 200, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }).start();
  };

  let baseStyle = 'py-4 px-6 rounded-2xl items-center justify-center flex-row shadow-sm';
  let textStyle = 'text-base font-bold';

  if (variant === 'primary') {
    baseStyle += ' bg-primary';
    textStyle += ' text-white';
  } else if (variant === 'secondary') {
    baseStyle += ' bg-secondary';
    textStyle += ' text-white';
  } else if (variant === 'outline') {
    baseStyle += ' bg-transparent border-2 border-primary';
    textStyle += ' text-primary';
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={baseStyle}
        style={style as any}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? '#0A0060' : '#FFFFFF'} />
        ) : (
          <Text className={textStyle}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
