import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Tag, CalendarClock, PlaneTakeoff, Info, CheckCircle2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

type NotificationType = 'price_alert' | 'booking_update' | 'promo' | 'system';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTo?: string; // route path
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'price_alert',
    title: 'Price Drop Alert! 📉',
    message: 'Flights to Tokyo for your dates have dropped by $120. Book now before they go back up!',
    timestamp: '10 mins ago',
    isRead: false,
    linkTo: '/search?mode=FLIGHTS&origin=London&destination=Tokyo',
  },
  {
    id: 'n2',
    type: 'booking_update',
    title: 'Check-in is Open',
    message: 'It is time to check in for your flight to JFK (DL 432). Have your passport ready.',
    timestamp: '2 hours ago',
    isRead: false,
    linkTo: '/trips/NY-001',
  },
  {
    id: 'n3',
    type: 'promo',
    title: 'Double Points Weekend! ✨',
    message: 'Earn 2x Dellics Rewards points on all hotel bookings made this weekend.',
    timestamp: '1 day ago',
    isRead: true,
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Welcome to Dellics Travels',
    message: 'Your profile setup is complete. Explore flights, hotels, and more!',
    timestamp: '3 days ago',
    isRead: true,
  }
];

export default function NotificationCenterScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Mark as read when pressed
    if (!notification.isRead) {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }

    if (notification.linkTo) {
      router.push(notification.linkTo as any);
    }
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'price_alert':
        return <Tag size={20} color="#F4740D" />;
      case 'booking_update':
        return <PlaneTakeoff size={20} color="#1E7A34" />;
      case 'promo':
        return <CheckCircle2 size={20} color="#0A0060" />;
      case 'system':
      default:
        return <Info size={20} color="#6B7280" />;
    }
  };

  const getIconBgForType = (type: NotificationType) => {
    switch (type) {
      case 'price_alert':
        return 'bg-orange-50';
      case 'booking_update':
        return 'bg-green-50';
      case 'promo':
        return 'bg-blue-50';
      case 'system':
      default:
        return 'bg-gray-100';
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <Pressable 
      onPress={() => handleNotificationPress(item)}
      className={`flex-row p-4 border-b border-gray-100 ${item.isRead ? 'bg-white' : 'bg-blue-50/30'}`}
    >
      <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${getIconBgForType(item.type)}`}>
        {getIconForType(item.type)}
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-1">
          <Text className={`text-base flex-1 pr-2 ${item.isRead ? 'font-bold text-gray-800' : 'font-black text-gray-900'}`}>
            {item.title}
          </Text>
          <Text className="text-xs text-gray-400 mt-0.5">{item.timestamp}</Text>
        </View>
        <Text className={`text-sm leading-relaxed ${item.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
          {item.message}
        </Text>
        
        {/* Unread Indicator dot */}
        {!item.isRead && (
          <View className="absolute top-1 -left-1 w-2 h-2 rounded-full bg-[#0A0060]" />
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
            className="p-2 mr-2 -ml-2"
          >
            <ChevronLeft size={24} color="#0A0060" />
          </Pressable>
          <Text className="text-xl font-black text-[#0A0060]">Notifications</Text>
        </View>
        
        {unreadCount > 0 && (
          <Pressable onPress={handleMarkAllRead} className="p-2 -mr-2">
            <Text className="text-[#0A0060] font-bold text-xs uppercase tracking-widest">Mark All Read</Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6">
            <Bell size={40} color="#D1D5DB" />
          </View>
          <Text className="text-xl font-black text-gray-900 mb-2">No Notifications</Text>
          <Text className="text-center text-gray-500">You're all caught up! We'll let you know when there's an update on your flights or prices.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </SafeAreaView>
  );
}
