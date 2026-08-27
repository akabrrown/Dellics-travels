import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function WriteReviewScreen() {
  const router = useRouter();
  const { bookingTitle } = useLocalSearchParams<{ bookingTitle?: string }>();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Thank You', 'Your review has been submitted.');
      router.back();
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <Text className="text-xl font-black text-[#0A0060]">Write a Review</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {bookingTitle && (
          <View className="bg-white border border-gray-200 p-4 mb-8" style={{ borderRadius: 8 }}>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Reviewing</Text>
            <Text className="font-bold text-gray-900 text-base">{bookingTitle}</Text>
          </View>
        )}

        {/* Star Rating */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-4">Your Rating</Text>
        <View className="flex-row justify-center mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => {
                Haptics.selectionAsync();
                setRating(star);
              }}
              className="mx-2"
            >
              <Star
                size={40}
                color={star <= rating ? '#F4740D' : '#E5E7EB'}
                fill={star <= rating ? '#F4740D' : 'transparent'}
              />
            </Pressable>
          ))}
        </View>

        {/* Review Text */}
        <Text className="text-[#0A0060] font-black text-xs uppercase tracking-widest mb-3">Your Review</Text>
        <View className="bg-white border border-gray-200" style={{ borderRadius: 8 }}>
          <TextInput
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="What did you like or dislike about your experience?"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            className="p-4 text-sm font-bold text-gray-900"
            style={{ minHeight: 120 }}
          />
        </View>

        <Text className="text-gray-400 text-xs font-semibold mt-3 px-1">
          Reviews are public and help other travelers make informed decisions.
        </Text>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-200">
        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          className={`items-center justify-center w-full ${submitting ? 'bg-gray-400' : 'bg-[#0A0060]'}`}
          style={{ height: 56, borderRadius: 4 }}
        >
          <Text className="text-white font-black text-sm tracking-widest uppercase">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
