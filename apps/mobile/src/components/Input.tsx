import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, rightIcon, ...props }: InputProps) {
  return (
    <View className="mb-4 w-full">
      <Text className="text-sm font-semibold text-primary mb-1 ml-1">{label}</Text>
      <View className={`bg-background border rounded-xl px-4 py-3 flex-row items-center focus:border-secondary shadow-sm ${error ? 'border-red-500' : 'border-gray-200'}`}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error ? <Text className="text-xs text-red-500 mt-1 ml-1">{error}</Text> : null}
    </View>
  );
}
