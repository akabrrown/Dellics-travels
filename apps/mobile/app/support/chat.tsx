import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send, Headphones } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

export default function LiveChatScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! Welcome to Dellics Travels support. How can I help you today?',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Auto-reply
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for reaching out. A support agent will be with you shortly. Our hours are Mon-Sat, 8AM-6PM GMT.",
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1200);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <View className="px-4 py-4 flex-row items-center border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-2">
          <ChevronLeft size={24} color="#0A0060" />
        </Pressable>
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 bg-[#0A0060] items-center justify-center mr-3" style={{ borderRadius: 4 }}>
            <Headphones size={16} color="white" />
          </View>
          <View>
            <Text className="font-black text-[#0A0060] text-base">Dellics Support</Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
              <Text className="text-green-700 text-[10px] font-black uppercase tracking-widest">Online</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-3 max-w-[80%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}
            >
              <View
                className={`p-4 ${msg.sender === 'user' ? 'bg-[#0A0060]' : 'bg-white border border-gray-200'}`}
                style={{ borderRadius: 8 }}
              >
                <Text className={`text-sm leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-gray-900'}`}>
                  {msg.text}
                </Text>
              </View>
              <Text className={`text-[10px] font-semibold mt-1 ${msg.sender === 'user' ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                {msg.timestamp}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-200">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-200 px-4 text-sm font-bold text-gray-900 mr-3"
            style={{ height: 44, borderRadius: 8 }}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <Pressable
            onPress={sendMessage}
            className="w-11 h-11 bg-[#0A0060] items-center justify-center"
            style={{ borderRadius: 4 }}
          >
            <Send size={18} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
