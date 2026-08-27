import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Pressable, Animated, Dimensions, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Home, Compass, Search, Briefcase, User, Smartphone } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');
// Calculate width of each tab slot based on container padding
const TAB_BAR_WIDTH = width - 40; // 20px padding on left and right
const TAB_WIDTH = TAB_BAR_WIDTH / 5; 

function TabBarIcon({ Icon, color, isFocused, title }: { Icon: any; color: string; isFocused: boolean; title: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Icon size={24} color={color} strokeWidth={isFocused ? 2.5 : 2} />
      <Text style={{ 
        color, 
        fontSize: 10, 
        fontWeight: isFocused ? '800' : '600', 
        marginTop: 4,
      }}>
        {title}
      </Text>
    </View>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Animated value to track the X position of the active pill
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
      friction: 6, // Controls the bounciness
      tension: 50, // Controls speed
    }).start();
  }, [state.index]);

  return (
    <View style={styles.tabBarContainer}>

      <View style={styles.tabContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          let IconComponent = Home;
          if (route.name === 'explore') IconComponent = Compass;
          if (route.name === 'trips') IconComponent = Briefcase;
          if (route.name === 'esim') IconComponent = Smartphone;
          if (route.name === 'profile') IconComponent = User;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              <TabBarIcon 
                Icon={IconComponent} 
                color={isFocused ? '#0A0060' : '#9CA3AF'} 
                isFocused={isFocused}
                title={options.title !== undefined ? options.title : route.name}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="trips" options={{ title: 'Trips' }} />
      <Tabs.Screen name="esim" options={{ title: 'e-Sim' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 68,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
